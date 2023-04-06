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
  CurrentUser,
  GitClientService,
  GitHubProviderOrganizationProperties,
  GitProviderArgs,
  GitProvidersConfiguration,
  OAuthData,
  isGitHubProviderOrganizationProperties,
  isOAuthProviderOrganizationProperties,
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

@Injectable()
export class GitProviderService {
  private gitProvidersConfiguration: GitProvidersConfiguration;

  constructor(
    private readonly prisma: PrismaService,
    private readonly resourceService: ResourceService,
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly analytics: SegmentAnalyticsService
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
    gitProviderArgs: GitProviderArgs,
    logger = this.logger
  ): Promise<GitClientService> {
    return new GitClientService().create(
      gitProviderArgs,
      this.gitProvidersConfiguration,
      logger
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

    const repositoriesArgs = {
      limit: args.limit,
      page: args.page,
      repositoryGroupName: args.repositoryGroupName,
    };

    const gitProviderArgs = await this.getGitProviderOrganizationProperties(
      organization
    );

    const gitClientService = await this.createGitClient(gitProviderArgs);
    return gitClientService.getRepositories(repositoriesArgs);
  }

  async createRemoteGitRepository(
    args: CreateGitRepositoryInput
  ): Promise<Resource> {
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId,
      },
    });

    if (organization.useGroupingForRepositories && !args.repositoryGroupName) {
      throw new ValidationError(
        `${organization.provider} requires a group to create a new repository. repositoryGroupName is missing`
      );
    }

    const repository = {
      repositoryName: args.name,
      gitOrganization: {
        name: organization.name,
        type: EnumGitOrganizationType[organization.type],
        useGroupingForRepositories: organization.useGroupingForRepositories,
      },
      repositoryGroupName: args.repositoryGroupName,
      owner: organization.name,
      isPrivateRepository: args.public,
    };

    const gitProviderArgs = await this.getGitProviderOrganizationProperties(
      organization
    );

    const gitClientService = await this.createGitClient(gitProviderArgs);
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
      groupName: args.repositoryGroupName,
      gitOrganizationId: args.gitOrganizationId,
      resourceId: args.resourceId,
    });
  }

  async createRemoteGitRepositoryWithoutConnect(
    args: CreateGitRepositoryBaseInput
  ): Promise<boolean> {
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId,
      },
    });
    const repository = {
      repositoryName: args.name,
      gitOrganization: {
        name: organization.name,
        type: EnumGitOrganizationType[organization.type],
        useGroupingForRepositories: organization.useGroupingForRepositories,
      },
      repositoryGroupName: args.repositoryGroupName,
      owner: organization.name,
      isPrivateRepository: args.public,
    };

    const gitProviderArgs = await this.getGitProviderOrganizationProperties(
      organization
    );

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
    const providerOrganizationProperties =
      this.createProviderOrganisationProperties(gitProvider, {
        installationId,
      });
    const gitProviderArgs = {
      provider: gitProvider,
      providerOrganizationProperties,
    };
    // instantiate the git client service with the provider and the provider properties
    const gitClientService = await this.createGitClient(gitProviderArgs);

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
    const providerOrganizationProperties = {
      installationId: null,
    };
    const gitProviderArgs = {
      provider: gitProvider,
      providerOrganizationProperties,
    };
    const gitClientService = await this.createGitClient(gitProviderArgs);
    return await gitClientService.getGitInstallationUrl(workspaceId);
  }

  async getCurrentOAuthUser(oAuthUserName: string): Promise<GitOrganization> {
    return this.prisma.gitOrganization.findFirst({
      where: { name: oAuthUserName },
    });
  }

  async getGitProviderOrganizationProperties(
    gitOrganization: GitOrganization
  ): Promise<GitProviderArgs> {
    const { id, installationId, provider, providerProperties } =
      gitOrganization;

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

      this.logger.info("Time left before token expires:", {
        value: `${timeInMsLeft / 60000} minutes`,
      });

      if (timeInMsLeft > 5 * 60 * 1000) {
        this.logger.debug("Token is still valid");
        return {
          provider: EnumGitProvider[provider],
          providerOrganizationProperties: providerProperties,
        };
      }

      const providerOrganizationProperties = { installationId };
      const newGitProviderArgs = {
        provider: EnumGitProvider[provider],
        providerOrganizationProperties,
      };

      const gitClientService = await this.createGitClient(newGitProviderArgs);
      this.logger.info("Token is going to be expired, refreshing...");
      const newOAuthData = await gitClientService.refreshAccessToken(
        providerProperties["refreshToken"]
      );

      const newProviderProperties = {
        ...(providerProperties as object),
        ...newOAuthData,
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
      "getGitProviderOrganizationProperties failed to detect provider organisation properties",
      {
        className: GitProviderService.name,
        provider,
        providerProperties,
      }
    );
    throw new AmplicationError(
      "Failed to detect provider organisation properties"
    );
  }

  async completeOAuth2Flow(
    args: CompleteGitOAuth2FlowArgs,
    currentUser: User
  ): Promise<GitOrganization> {
    const { code, gitProvider, workspaceId } = args.data;

    // provider properties to instantiate the git client service
    const gitProviderArgs: GitProviderArgs = {
      provider: gitProvider,
      providerOrganizationProperties: null,
    };

    const gitClientService = await this.createGitClient(gitProviderArgs);

    const oAuthData = await gitClientService.getAccessToken(code);

    const currentUserData = await gitClientService.getCurrentOAuthUser(
      oAuthData.accessToken
    );

    const providerOrganizationProperties =
      this.createProviderOrganisationProperties(gitProvider, {
        auth: oAuthData,
        user: currentUserData,
      });

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
        type: EnumGitOrganizationType.User,
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

    const gitProviderArgs = await this.getGitProviderOrganizationProperties(
      organization
    );
    const gitClientService = await this.createGitClient(gitProviderArgs);

    return await gitClientService.getGitGroups();
  }

  async deleteGitOrganization(
    args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    const { gitProvider, gitOrganizationId } = args;

    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );
    const gitProviderArgs = {
      provider: gitProvider,
      providerOrganizationProperties: { installationId },
    };
    const gitClientService = await this.createGitClient(gitProviderArgs);
    if (installationId) {
      const isDelete = await gitClientService.deleteGitOrganization();
      if (isDelete) {
        await this.prisma.gitOrganization.delete({
          where: {
            id: gitOrganizationId,
          },
        });
      } else {
        throw new AmplicationError(
          `delete installationId: ${installationId} failed`
        );
      }
    }
    return true;
  }

  private async getInstallationIdByGitOrganizationId(
    gitOrganizationId: string
  ): Promise<string | null> {
    return (
      await this.prisma.gitOrganization.findUnique({
        where: {
          id: gitOrganizationId,
        },
      })
    ).installationId;
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

  private createProviderOrganisationProperties(
    gitProvider: EnumGitProvider,
    options: {
      auth?: OAuthData;
      user?: CurrentUser;
      installationId?: string;
    }
  ) {
    if (gitProvider === EnumGitProvider.Github) {
      const properties: GitHubProviderOrganizationProperties = {
        installationId: options.installationId,
      };
      return properties;
    } else if (gitProvider === EnumGitProvider.Bitbucket) {
      const properties: OAuthProviderOrganizationProperties = {
        ...options.auth,
        ...options.user,
      };
      return properties;
    }
  }
}
