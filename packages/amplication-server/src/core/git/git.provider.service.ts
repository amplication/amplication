import { Inject, Injectable } from "@nestjs/common";
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
  isGitHubProviderOrganizationProperties,
  isOAuthProviderOrganizationProperties,
  GetRepositoriesArgs,
  CreateRepositoryArgs,
} from "@amplication/git-utils";
import {
  INVALID_RESOURCE_ID,
  ResourceService,
} from "../resource/resource.service";
import { CompleteGitOAuth2FlowArgs } from "./dto/args/CompleteGitOAuth2FlowArgs";
import { EnumGitOrganizationType } from "./dto/enums/EnumGitOrganizationType";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { CreateGitRepositoryBaseInput } from "./dto/inputs/CreateGitRepositoryBaseInput";
import { GitGroupArgs } from "./dto/args/GitGroupArgs";
import { PaginatedGitGroup } from "./dto/objects/PaginatedGitGroup";
import { EnumGitProvider } from "./dto/enums/EnumGitProvider";
import { ValidationError } from "../../errors/ValidationError";

const GIT_REPOSITORY_EXIST =
  "Git Repository already connected to an other Resource";
const INVALID_GIT_REPOSITORY_ID = "Git Repository does not exist";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { User } from "../../models";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "../billing/billing.types";

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
    private readonly billingService: BillingService
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
    let providerOrganizationProperties:
      | GitHubProviderOrganizationProperties
      | OAuthProviderOrganizationProperties;

    if (provider === EnumGitProvider.Github) {
      providerOrganizationProperties = {
        installationId: null,
      };
    } else if (provider === EnumGitProvider.Bitbucket) {
      providerOrganizationProperties = {
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

  async createRemoteGitRepository(
    args: CreateGitRepositoryInput
  ): Promise<Resource> {
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

    return await this.connectResourceGitRepository({
      name: remoteRepository.name,
      groupName: args.groupName,
      gitOrganizationId: args.gitOrganizationId,
      resourceId: args.resourceId,
    });
  }

  async createRemoteGitRepositoryWithoutConnect(
    args: CreateGitRepositoryBaseInput
  ): Promise<boolean> {
    // negate the isPublic flag to get the isPrivate flag
    const isPrivateRepository = args.isPublic ? !args.isPublic : true;
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId,
      },
    });
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
    return true;
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

  // installation id flow (GitHub ONLY!)
  async createGitOrganization(
    args: CreateGitOrganizationArgs,
    currentUser: User
  ): Promise<GitOrganization> {
    if (args.data.gitProvider !== EnumGitProvider.Github) {
      throw new AmplicationError("Unsupported provider");
    }

    const { gitProvider, installationId } = args.data;
    // get the provider properties of the installationId flow (GitHub)
    const providerOrganizationProperties: GitHubProviderOrganizationProperties =
      {
        installationId,
      };
    const gitProviderArgs = {
      provider: gitProvider,
      providerOrganizationProperties,
    };

    // instantiate the git client service with the provider and the provider properties
    const gitClientService = await new GitClientService().create(
      gitProviderArgs,
      this.gitProvidersConfiguration,
      this.logger
    );

    const gitRemoteOrganization = await gitClientService.getOrganization();

    const gitOrganization = await this.prisma.gitOrganization.findFirst({
      where: {
        installationId: installationId,
        provider: gitProvider,
      },
    });

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
          providerProperties: providerOrganizationProperties as any,
        },
      });
    }

    await this.analytics.track({
      userId: currentUser.account.id,
      properties: {
        workspaceId: args.data.workspaceId,
        provider: gitProvider,
      },
      event: EnumEventType.GitHubAuthResourceComplete,
    });

    return await this.prisma.gitOrganization.create({
      data: {
        workspace: {
          connect: {
            id: args.data.workspaceId,
          },
        },
        installationId,
        name: gitRemoteOrganization.name,
        provider: gitProvider,
        type: gitRemoteOrganization.type,
        useGroupingForRepositories:
          gitRemoteOrganization.useGroupingForRepositories,
        providerProperties: providerOrganizationProperties as any,
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

  async getCurrentOAuthUser(oAuthUserName: string): Promise<GitOrganization> {
    return this.prisma.gitOrganization.findFirst({
      where: { name: oAuthUserName },
    });
  }

  async getGitProviderProperties(
    gitOrganization: GitOrganization
  ): Promise<GitProviderArgs> {
    const { id, provider, providerProperties } = gitOrganization;

    if (
      provider === EnumGitProvider.Github &&
      isGitHubProviderOrganizationProperties(providerProperties)
    ) {
      return {
        provider: EnumGitProvider[provider],
        providerOrganizationProperties: providerProperties,
      };
    }

    if (isOAuthProviderOrganizationProperties(providerProperties)) {
      const timeInMsLeft = providerProperties.expiresAt - Date.now();

      this.logger.debug("Time left before token expires:", {
        value: `${timeInMsLeft / 60000} minutes`,
      });

      if (timeInMsLeft > 5 * 60 * 1000) {
        this.logger.debug("Token is still valid");
        return {
          provider: EnumGitProvider[provider],
          providerOrganizationProperties: providerProperties,
        };
      }

      const gitClientService = await new GitClientService().create(
        {
          provider: EnumGitProvider[provider],
          providerOrganizationProperties: providerProperties,
        },
        this.gitProvidersConfiguration,
        this.logger
      );

      this.logger.info("Token is going to be expired, refreshing...");
      const newOAuthTokens = await gitClientService.refreshAccessToken();

      const newProviderProperties = {
        ...(providerProperties as object),
        ...newOAuthTokens,
      };

      const updatedGitOrganization = await this.prisma.gitOrganization.update({
        where: {
          id,
        },
        data: {
          providerProperties: newProviderProperties,
        },
      });

      if (
        isOAuthProviderOrganizationProperties(
          updatedGitOrganization.providerProperties
        )
      ) {
        return {
          provider: EnumGitProvider[updatedGitOrganization.provider],
          providerOrganizationProperties:
            updatedGitOrganization.providerProperties,
        };
      }
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

    await this.analytics.track({
      userId: currentUser.account.id,
      properties: {
        workspaceId: workspaceId,
        provider: gitProvider,
      },
      event: EnumEventType.GitHubAuthResourceComplete,
    });

    this.logger.info("server: completeOAuth2Flow");

    return this.prisma.gitOrganization.upsert({
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
}
