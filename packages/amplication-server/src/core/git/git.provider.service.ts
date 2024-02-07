import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { isEmpty } from "lodash";
import { PrismaService, Prisma, EnumResourceType } from "../../prisma";
import { FindOneArgs } from "../../dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { Resource } from "../../models/Resource";
import { GitOrganization } from "../../models/GitOrganization";
import { CreateGitOrganizationArgs } from "./dto/args/CreateGitOrganizationArgs";
import { DeleteGitOrganizationArgs } from "./dto/args/DeleteGitOrganizationArgs";
import { DeleteGitRepositoryArgs } from "./dto/args/DeleteGitRepositoryArgs";
import { GetGitInstallationUrlArgs } from "./dto/args/GetGitInstallationUrlArgs";
import { GitOrganizationFindManyArgs } from "./dto/args/GitOrganizationFindManyArgs";
import { ConnectGitRepositoryInput } from "./dto/inputs/ConnectGitRepositoryInput";
import { CreateGitRepositoryInput } from "./dto/inputs/CreateGitRepositoryInput";
import { RemoteGitRepositoriesWhereUniqueInput } from "./dto/inputs/RemoteGitRepositoriesWhereUniqueInput";
import { RemoteGitRepos } from "./dto/objects/RemoteGitRepository";
import {
  OAuthProviderOrganizationProperties,
  GitClientService,
  GitHubProviderOrganizationProperties,
  GitProviderArgs,
  GitProvidersConfiguration,
  GetRepositoriesArgs,
  CreateRepositoryArgs,
  RemoteGitRepository,
  GitProviderProperties,
  AwsCodeCommitProviderOrganizationProperties,
  isValidGitProviderProperties,
} from "@amplication/util/git";
import {
  INVALID_RESOURCE_ID,
  ResourceService,
} from "../resource/resource.service";
import { CompleteGitOAuth2FlowArgs } from "./dto/args/CompleteGitOAuth2FlowArgs";
import { EnumGitOrganizationType } from "./dto/enums/EnumGitOrganizationType";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { GitGroupArgs } from "./dto/args/GitGroupArgs";
import { PaginatedGitGroup } from "./dto/objects/PaginatedGitGroup";
import { EnumGitProvider } from "./dto/enums/EnumGitProvider";
import { ValidationError } from "../../errors/ValidationError";

const GIT_REPOSITORY_EXIST =
  "Git Repository already connected to an other Resource";
const INVALID_GIT_REPOSITORY_ID = "Git Repository does not exist";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { GitRepository, User } from "../../models";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { ProjectService } from "../project/project.service";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { UpdateGitRepositoryArgs } from "./dto/args/UpdateGitRepositoryArgs";

@Traceable()
@Injectable()
export class GitProviderService {
  private gitProvidersConfiguration: GitProvidersConfiguration;

  constructor(
    private readonly prisma: PrismaService,
    private readonly resourceService: ResourceService,
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly analytics: SegmentAnalyticsService,
    private readonly billingService: BillingService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService
  ) {
    const bitbucketClientId = this.configService.get<string>(
      Env.BITBUCKET_CLIENT_ID
    );
    const bitbucketClientSecret = this.configService.get<string>(
      Env.BITBUCKET_CLIENT_SECRET
    );
    const githubClientId = this.configService.get<string>(
      Env.GITHUB_APP_CLIENT_ID
    );
    const githubClientSecret = this.configService.get<string>(
      Env.GITHUB_APP_CLIENT_SECRET
    );
    const githubAppId = this.configService.get<string>(Env.GITHUB_APP_APP_ID);
    const githubAppPrivateKey = this.configService.get<string>(
      Env.GITHUB_APP_PRIVATE_KEY
    );
    const githubAppInstallationUrl = this.configService.get<string>(
      Env.GITHUB_APP_INSTALLATION_URL
    );

    this.gitProvidersConfiguration = {
      gitHubConfiguration: {
        clientId: githubClientId,
        clientSecret: githubClientSecret,
        appId: githubAppId,
        privateKey: githubAppPrivateKey,
        installationUrl: githubAppInstallationUrl,
      },
      bitBucketConfiguration: {
        clientId: bitbucketClientId,
        clientSecret: bitbucketClientSecret,
      },
    };
  }

  async createGitClient(
    gitOrganization: GitOrganization
  ): Promise<GitClientService> {
    const gitProviderArgs = await this.getGitProviderProperties(
      gitOrganization
    );
    return new GitClientService().create(
      gitProviderArgs,
      this.gitProvidersConfiguration,
      this.logger
    );
  }

  /**
   * Initialise a git client service for actions that don't need provider properties.
   * i.e. Actions pre-auth.
   * @param provider
   * @returns git client service
   */
  async createGitClientWithoutProperties(
    provider: EnumGitProvider
  ): Promise<GitClientService> {
    let providerOrganizationProperties: GitProviderProperties;

    if (provider === EnumGitProvider.AwsCodeCommit) {
      throw new AmplicationError(
        "AWS CodeCommit is not supported without provider properties"
      );
    } else if (provider === EnumGitProvider.Github) {
      providerOrganizationProperties = <GitHubProviderOrganizationProperties>{
        installationId: null,
      };
    } else if (provider === EnumGitProvider.Bitbucket) {
      providerOrganizationProperties = <OAuthProviderOrganizationProperties>{
        links: null,
        username: null,
        useGroupingForRepositories: null,
        uuid: null,
        displayName: null,
        accessToken: null,
        refreshToken: null,
        tokenType: null,
        expiresAt: null,
        scopes: null,
      };
    }
    return new GitClientService().create(
      { provider, providerOrganizationProperties },
      this.gitProvidersConfiguration,
      this.logger
    );
  }

  async getReposOfOrganization(
    args: RemoteGitRepositoriesWhereUniqueInput
  ): Promise<RemoteGitRepos> {
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId,
      },
    });

    const repositoriesArgs: GetRepositoriesArgs = {
      pagination: {
        page: args.page,
        perPage: args.perPage,
      },
      groupName: args.groupName,
    };

    const gitClientService = await this.createGitClient(organization);
    return gitClientService.getRepositories(repositoriesArgs);
  }

  async connectGitRepository(
    args: CreateGitRepositoryInput
  ): Promise<Resource | boolean> {
    const remoteRepository = await this.createRemoteGitRepository(args);

    const { groupName, gitOrganizationId, resourceId } = args;

    return resourceId
      ? await this.connectResourceGitRepository({
          name: remoteRepository.name,
          ...(groupName ? { groupName } : {}),
          gitOrganizationId,
          resourceId,
        })
      : true;
  }

  async createRemoteGitRepository(
    args: CreateGitRepositoryInput
  ): Promise<RemoteGitRepository> {
    // negate the isPublic flag to get the isPrivate flag
    const isPrivateRepository = args.isPublic ? !args.isPublic : true;
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId,
      },
    });

    if (organization.useGroupingForRepositories && !args.groupName) {
      throw new ValidationError(
        `${organization.provider} requires a group to create a new repository. groupName is missing`
      );
    }

    const repository: CreateRepositoryArgs = {
      repositoryName: args.name,
      gitOrganization: {
        name: organization.name,
        type: EnumGitOrganizationType[organization.type],
        useGroupingForRepositories: organization.useGroupingForRepositories,
      },
      groupName: args.groupName,
      owner: organization.name,
      isPrivate: isPrivateRepository,
    };

    const gitClientService = await this.createGitClient(organization);

    const remoteRepository = await gitClientService.createRepository(
      repository
    );

    if (!remoteRepository) {
      throw new AmplicationError(
        `Failed to create ${args.gitProvider} repository ${organization.name}\\${args.name}`
      );
    }
    return remoteRepository;
  }

  async deleteGitRepository(args: DeleteGitRepositoryArgs): Promise<boolean> {
    const gitRepository = await this.prisma.gitRepository.findUnique({
      where: {
        id: args.gitRepositoryId,
      },
    });

    if (isEmpty(gitRepository)) {
      throw new AmplicationError(INVALID_GIT_REPOSITORY_ID);
    }

    await this.prisma.gitRepository.delete({
      where: {
        id: args.gitRepositoryId,
      },
    });

    return true;
  }

  async updateGitRepository(
    args: UpdateGitRepositoryArgs
  ): Promise<GitRepository> {
    return this.prisma.gitRepository.update(args);
  }

  async disconnectResourceGitRepository(resourceId: string): Promise<Resource> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
      include: {
        gitRepository: true,
      },
    });

    if (isEmpty(resource)) throw new AmplicationError(INVALID_RESOURCE_ID);

    const resourcesToDisconnect = await this.getInheritProjectResources(
      resource.projectId,
      resourceId,
      resource.resourceType
    );

    await this.prisma.gitRepository.update({
      where: {
        id: resource.gitRepositoryId,
      },
      data: {
        resources: {
          disconnect: resourcesToDisconnect,
        },
      },
    });

    const countResourcesConnected = await this.prisma.gitRepository
      .findUnique({
        where: {
          id: resource.gitRepositoryId,
        },
      })
      .resources();

    if (countResourcesConnected.length === 0) {
      await this.prisma.gitRepository.delete({
        where: {
          id: resource.gitRepositoryId,
        },
      });
    }

    return resource;
  }

  async connectResourceToProjectRepository(
    resourceId: string
  ): Promise<Resource> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
    });

    if (isEmpty(resource)) throw new AmplicationError(INVALID_RESOURCE_ID);

    if (resource.gitRepositoryId) {
      await this.disconnectResourceGitRepository(resourceId);
    }

    const projectConfigurationRepository = await this.prisma.resource
      .findFirst({
        where: {
          projectId: resource.projectId,
          resourceType: EnumResourceType.ProjectConfiguration,
        },
      })
      .gitRepository();

    if (isEmpty(projectConfigurationRepository)) {
      return resource;
    }
    const resourceWithProjectRepository = await this.prisma.resource.update({
      where: {
        id: resourceId,
      },
      data: {
        gitRepository: {
          connect: {
            id: projectConfigurationRepository.id,
          },
        },
      },
    });
    return resourceWithProjectRepository;
  }

  async connectResourceGitRepository({
    resourceId,
    name,
    gitOrganizationId,
    groupName,
  }: ConnectGitRepositoryInput): Promise<Resource> {
    const gitRepository = await this.prisma.gitRepository.findFirst({
      where: { resources: { some: { id: resourceId } } },
    });

    if (gitRepository) {
      throw new AmplicationError(GIT_REPOSITORY_EXIST);
    }

    const resource = await this.resourceService.resource({
      where: {
        id: resourceId,
      },
    });

    const resourcesToConnect = await this.getInheritProjectResources(
      resource.projectId,
      resourceId,
      resource.resourceType
    );

    await this.prisma.gitRepository.create({
      data: {
        name: name,
        groupName: groupName,
        resources: { connect: resourcesToConnect },
        gitOrganization: { connect: { id: gitOrganizationId } },
      },
    });

    return resource;
  }

  async createGitOrganization(
    args: CreateGitOrganizationArgs,
    currentUser: User
  ): Promise<GitOrganization> {
    let installationId: string;
    let gitProviderArgs: GitProviderArgs;
    const { gitProvider, workspaceId, awsCodeCommitInput, githubInput } =
      args.data;

    let gitOrganization: GitOrganization;

    if (gitProvider === EnumGitProvider.Github) {
      installationId = githubInput.installationId;
      // get the provider properties of the installationId flow (GitHub)
      const providerOrganizationProperties: GitHubProviderOrganizationProperties =
        {
          installationId,
        };

      gitProviderArgs = {
        provider: gitProvider,
        providerOrganizationProperties,
      };

      gitOrganization = await this.prisma.gitOrganization.findFirst({
        where: {
          installationId: installationId,
          provider: gitProvider,
        },
      });
    } else if (gitProvider === EnumGitProvider.AwsCodeCommit) {
      const awsCodeCommitEntitlement = this.billingService.isBillingEnabled
        ? await this.billingService.getBooleanEntitlement(
            workspaceId,
            BillingFeature.AwsCodeCommit
          )
        : false;
      if (!awsCodeCommitEntitlement) {
        throw new AmplicationError(
          "In order to connect AWS CodeCommit service should upgrade its plan"
        );
      }

      const {
        gitUsername: username,
        gitPassword: password,
        accessKeyId,
        accessKeySecret,
        region,
      } = awsCodeCommitInput;

      installationId = accessKeyId;

      // get the provider properties of the installationId flow (AWS CodeCommit)
      const providerOrganizationProperties: AwsCodeCommitProviderOrganizationProperties =
        {
          gitCredentials: {
            username,
            password,
          },
          sdkCredentials: {
            accessKeyId,
            accessKeySecret,
            region,
          },
        };

      gitProviderArgs = {
        provider: gitProvider,
        providerOrganizationProperties,
      };
    } else {
      throw new ValidationError("Unsupported git provider");
    }

    // instantiate the git client service with the provider and the provider properties
    const gitClientService = await new GitClientService().create(
      gitProviderArgs,
      this.gitProvidersConfiguration,
      this.logger
    );

    const gitRemoteOrganization = await gitClientService.getOrganization();

    await this.analytics.track({
      userId: currentUser.account.id,
      properties: {
        workspaceId: workspaceId,
        provider: gitProvider,
        gitOrgType: gitRemoteOrganization.type,
        $groups: { groupWorkspace: workspaceId },
      },
      event: EnumEventType.GitHubAuthResourceComplete,
    });

    await this.projectService.disableDemoRepoForAllWorkspaceProjects(
      workspaceId
    );

    // save or update the git organization with its provider and provider properties
    if (gitOrganization) {
      return await this.prisma.gitOrganization.update({
        where: {
          id: gitOrganization.id,
        },
        data: {
          provider: gitProvider,
          installationId: installationId,
          name: gitRemoteOrganization.name,
          type: gitRemoteOrganization.type,
          providerProperties:
            gitProviderArgs.providerOrganizationProperties as any,
        },
      });
    }

    return await this.prisma.gitOrganization.create({
      data: {
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        installationId,
        name: gitRemoteOrganization.name,
        provider: gitProvider,
        type: gitRemoteOrganization.type,
        useGroupingForRepositories:
          gitRemoteOrganization.useGroupingForRepositories,
        providerProperties:
          gitProviderArgs.providerOrganizationProperties as any,
      },
    });
  }

  async getGitOrganizations(
    args: GitOrganizationFindManyArgs
  ): Promise<GitOrganization[]> {
    return await this.prisma.gitOrganization.findMany(args);
  }

  async getGitOrganization(args: FindOneArgs): Promise<GitOrganization> {
    return await this.prisma.gitOrganization.findUnique(args);
  }

  async getGitOrganizationByRepository(
    args: FindOneArgs
  ): Promise<GitOrganization> {
    return await this.prisma.gitRepository.findUnique(args).gitOrganization();
  }

  async getGitInstallationUrl(
    args: GetGitInstallationUrlArgs
  ): Promise<string> {
    const { gitProvider, workspaceId } = args.data;
    const gitClientService = await this.createGitClientWithoutProperties(
      gitProvider
    );
    return await gitClientService.getGitInstallationUrl(workspaceId);
  }

  async getProjectsConnectedGitRepositories(
    projectIds: string[]
  ): Promise<GitRepository[]> {
    return this.prisma.gitRepository.findMany({
      where: {
        resources: {
          some: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            AND: {
              deletedAt: null,
              archived: { not: true },
              projectId: {
                in: projectIds,
              },
            },
          },
        },
      },
      include: {
        gitOrganization: true,
      },
    });
  }

  async getCurrentOAuthUser(oAuthUserName: string): Promise<GitOrganization> {
    return this.prisma.gitOrganization.findFirst({
      where: { name: oAuthUserName },
    });
  }

  async getGitProviderProperties(
    gitOrganization: GitOrganization
  ): Promise<GitProviderArgs> {
    const { provider, providerProperties } = gitOrganization;

    if (isValidGitProviderProperties[provider](providerProperties)) {
      return {
        provider: EnumGitProvider[provider],
        providerOrganizationProperties: providerProperties,
      };
    }

    this.logger.error(
      "getGitProviderProperties failed to detect provider organization properties",
      null,
      {
        className: GitProviderService.name,
        provider,
        providerProperties,
      }
    );
    throw new AmplicationError(
      "Failed to detect provider organization properties"
    );
  }

  async completeOAuth2Flow(
    args: CompleteGitOAuth2FlowArgs,
    currentUser: User
  ): Promise<GitOrganization> {
    const { code, gitProvider, workspaceId } = args.data;

    const bitbucketEntitlement = this.billingService.isBillingEnabled
      ? await this.billingService.getBooleanEntitlement(
          workspaceId,
          BillingFeature.Bitbucket
        )
      : false;
    if (!bitbucketEntitlement)
      throw new AmplicationError(
        "In order to connect Bitbucket service should upgrade its plan"
      );

    const gitClientService = await this.createGitClientWithoutProperties(
      gitProvider
    );

    const oAuthTokens = await gitClientService.getOAuthTokens(code);

    const currentUserData = await gitClientService.getCurrentOAuthUser(
      oAuthTokens.accessToken
    );

    const providerOrganizationProperties: OAuthProviderOrganizationProperties =
      { ...oAuthTokens, ...currentUserData };

    this.logger.info("server: completeOAuth2Flow");

    await this.projectService.disableDemoRepoForAllWorkspaceProjects(
      workspaceId
    );

    const gitOrganization = await this.prisma.gitOrganization.upsert({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        provider_installationId: {
          provider: gitProvider,
          installationId: currentUserData.uuid,
        },
      },
      create: {
        provider: gitProvider,
        installationId: currentUserData.uuid,
        name: currentUserData.username,
        type: EnumGitOrganizationType.Organization,
        useGroupingForRepositories: currentUserData.useGroupingForRepositories,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        providerProperties: providerOrganizationProperties as any,
      },
      update: {
        name: currentUserData.username,
        providerProperties: providerOrganizationProperties as any,
      },
    });

    await this.analytics.track({
      userId: currentUser.account.id,
      properties: {
        workspaceId: workspaceId,
        provider: gitProvider,
        gitOrgType: gitOrganization?.type,
        $groups: { groupWorkspace: workspaceId },
      },
      event: EnumEventType.GitHubAuthResourceComplete,
    });

    return gitOrganization;
  }

  async getGitGroups(args: GitGroupArgs): Promise<PaginatedGitGroup> {
    const organization = await this.getGitOrganization({
      where: {
        id: args.where.organizationId,
      },
    });

    const gitClientService = await this.createGitClient(organization);

    return await gitClientService.getGitGroups();
  }

  async deleteGitOrganization(
    args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    const { gitOrganizationId } = args;

    const organization = await this.getGitOrganization({
      where: {
        id: gitOrganizationId,
      },
    });
    const gitClientService = await this.createGitClient(organization);
    const isDelete = await gitClientService.deleteGitOrganization();
    if (isDelete) {
      await this.prisma.gitOrganization.delete({
        where: {
          id: gitOrganizationId,
        },
      });
    } else {
      this.logger.error("Failed to delete git provider integration", null, {
        organization,
      });
      throw new AmplicationError("Failed to delete git provider integration");
    }
    return true;
  }

  private async getInheritProjectResources(
    projectId: string,
    resourceId: string,
    resourceType: EnumResourceType
  ): Promise<Prisma.ResourceWhereUniqueInput[]> {
    let resourcesToConnect: Prisma.ResourceWhereUniqueInput[];

    if (resourceType === EnumResourceType.ProjectConfiguration) {
      const resources = await this.prisma.resource.findMany({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          OR: [
            {
              projectId: projectId,
              gitRepositoryOverride: false,
            },
            {
              id: resourceId,
            },
          ],
        },
      });

      resourcesToConnect = resources.map((r) => ({ id: r.id }));
    } else {
      resourcesToConnect = [
        {
          id: resourceId,
        },
      ];
    }
    return resourcesToConnect;
  }

  async createDemoRepository(repoName: string) {
    const organizationName = this.configService.get<string>(
      Env.GITHUB_DEMO_REPO_ORGANIZATION_NAME
    );

    const installationId = this.configService.get<string>(
      Env.GITHUB_DEMO_REPO_INSTALLATION_ID
    );

    const repository: CreateRepositoryArgs = {
      repositoryName: repoName,
      gitOrganization: {
        name: organizationName,
        type: EnumGitOrganizationType.Organization,
        useGroupingForRepositories: false,
      },
      groupName: undefined,
      owner: organizationName,
      isPrivate: false,
    };

    const gitProviderArgs: GitProviderArgs = {
      provider: EnumGitProvider.Github,
      providerOrganizationProperties: {
        installationId,
      },
    };

    const gitClientService = await new GitClientService().create(
      gitProviderArgs,
      this.gitProvidersConfiguration,
      this.logger
    );
    const remoteRepository = await gitClientService.createRepository(
      repository
    );

    if (!remoteRepository) {
      throw new AmplicationError(
        `Failed to create demo repository ${organizationName}\\${repoName}`
      );
    }
  }
}
