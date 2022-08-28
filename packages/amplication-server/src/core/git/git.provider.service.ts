import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import {
  EnumResourceType,
  Prisma,
  PrismaService
} from '@amplication/prisma-db';
import { FindOneArgs } from 'src/dto';
import { AmplicationError } from 'src/errors/AmplicationError';
import { Resource } from 'src/models/Resource';
import { GitOrganization } from 'src/models/GitOrganization';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { DeleteGitOrganizationArgs } from './dto/args/DeleteGitOrganizationArgs';
import { DeleteGitRepositoryArgs } from './dto/args/DeleteGitRepositoryArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { GitOrganizationFindManyArgs } from './dto/args/GitOrganizationFindManyArgs';
import { ConnectGitRepositoryInput } from './dto/inputs/ConnectGitRepositoryInput';
import { CreateGitRepositoryInput } from './dto/inputs/CreateGitRepositoryInput';
import { RemoteGitRepositoriesWhereUniqueInput } from './dto/inputs/RemoteGitRepositoriesWhereUniqueInput';
import { RemoteGitRepository } from './dto/objects/RemoteGitRepository';
import { GitService, EnumGitOrganizationType } from '@amplication/git-service';
import {
  INVALID_RESOURCE_ID,
  ResourceService
} from '../resource/resource.service';

const GIT_REPOSITORY_EXIST =
  'Git Repository already connected to an other Resource';
const INVALID_GIT_REPOSITORY_ID = 'Git Repository does not exist';

@Injectable()
export class GitProviderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gitService: GitService,
    private readonly resourceService: ResourceService
  ) {}

  async getReposOfOrganization(
    args: RemoteGitRepositoriesWhereUniqueInput
  ): Promise<RemoteGitRepository[]> {
    const installationId = await this.getInstallationIdByGitOrganizationId(
      args.gitOrganizationId
    );
    return await this.gitService.getReposOfOrganization(
      args.gitProvider,
      installationId
    );
  }

  async createRemoteGitRepository(
    args: CreateGitRepositoryInput
  ): Promise<Resource> {
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId
      }
    });

    const remoteRepository = await this.gitService.createGitRepository(
      args.name,
      args.gitProvider,
      EnumGitOrganizationType[organization.type],
      organization.name,
      organization.installationId,
      args.public
    );

    if (!remoteRepository) {
      throw new AmplicationError(
        `Failed to create ${args.gitProvider} repository ${organization.name}\\${args.name}`
      );
    }

    return await this.connectResourceGitRepository({
      name: remoteRepository.name,
      gitOrganizationId: args.gitOrganizationId,
      resourceId: args.resourceId
    });
  }

  async deleteGitRepository(args: DeleteGitRepositoryArgs): Promise<boolean> {
    const gitRepository = await this.prisma.gitRepository.findUnique({
      where: {
        id: args.gitRepositoryId
      }
    });

    if (isEmpty(gitRepository)) {
      throw new AmplicationError(INVALID_GIT_REPOSITORY_ID);
    }

    await this.prisma.gitRepository.delete({
      where: {
        id: args.gitRepositoryId
      }
    });

    return true;
  }

  async disconnectResourceGitRepository(resourceId: string): Promise<Resource> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId
      },
      include: {
        gitRepository: true
      }
    });

    if (isEmpty(resource)) throw new AmplicationError(INVALID_RESOURCE_ID);

    const resourcesToDisconnect = await this.getInheritProjectResources(
      resource.projectId,
      resourceId,
      resource.resourceType
    );

    await this.prisma.gitRepository.update({
      where: {
        id: resource.gitRepositoryId
      },
      data: {
        resources: {
          disconnect: resourcesToDisconnect
        }
      }
    });

    const countResourcesConnected = await this.prisma.gitRepository
      .findUnique({
        where: {
          id: resource.gitRepositoryId
        }
      })
      .resources();

    if (countResourcesConnected.length === 0) {
      await this.prisma.gitRepository.delete({
        where: {
          id: resource.gitRepositoryId
        }
      });
    }

    return resource;
  }

  async connectResourceToProjectRepository(
    resourceId: string
  ): Promise<Resource> {
    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId
      }
    });

    if (isEmpty(resource)) throw new AmplicationError(INVALID_RESOURCE_ID);

    if (resource.gitRepositoryId) {
      await this.disconnectResourceGitRepository(resourceId);
    }

    const projectConfigurationRepository = await this.prisma.resource
      .findFirst({
        where: {
          projectId: resource.projectId,
          resourceType: EnumResourceType.ProjectConfiguration
        }
      })
      .gitRepository();

    if (isEmpty(projectConfigurationRepository)) {
      return resource;
    }
    const resourceWithProjectRepository = await this.prisma.resource.update({
      where: {
        id: resourceId
      },
      data: {
        gitRepository: {
          connect: {
            id: projectConfigurationRepository.id
          }
        }
      }
    });
    return resourceWithProjectRepository;
  }

  async connectResourceGitRepository({
    resourceId,
    name,
    gitOrganizationId
  }: ConnectGitRepositoryInput): Promise<Resource> {
    const gitRepository = await this.prisma.gitRepository.findFirst({
      where: { resources: { some: { id: resourceId } } }
    });

    if (gitRepository) {
      throw new AmplicationError(GIT_REPOSITORY_EXIST);
    }

    const resource = await this.resourceService.resource({
      where: {
        id: resourceId
      }
    });

    const resourcesToConnect = await this.getInheritProjectResources(
      resource.projectId,
      resourceId,
      resource.resourceType
    );

    await this.prisma.gitRepository.create({
      data: {
        name: name,
        resources: { connect: resourcesToConnect },
        gitOrganization: { connect: { id: gitOrganizationId } }
      }
    });

    return await this.prisma.resource.findUnique({
      where: {
        id: resourceId
      }
    });
  }

  async createGitOrganization(
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    const { gitProvider, installationId } = args.data;

    const gitRemoteOrganization = await this.gitService.getGitRemoteOrganization(
      installationId,
      gitProvider
    );

    const gitOrganization = await this.prisma.gitOrganization.findFirst({
      where: {
        installationId: installationId,
        provider: gitProvider
      }
    });

    if (gitOrganization) {
      return await this.prisma.gitOrganization.update({
        where: {
          id: gitOrganization.id
        },
        data: {
          provider: gitProvider,
          installationId: installationId,
          name: gitRemoteOrganization.name,
          type: gitRemoteOrganization.type
        }
      });
    }

    return await this.prisma.gitOrganization.create({
      data: {
        workspace: {
          connect: {
            id: args.data.workspaceId
          }
        },
        installationId: installationId,
        name: gitRemoteOrganization.name,
        provider: gitProvider,
        type: gitRemoteOrganization.type
      }
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
    return await this.gitService.getGitInstallationUrl(
      gitProvider,
      workspaceId
    );
  }

  async deleteGitOrganization(
    args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    const { gitProvider, gitOrganizationId } = args;
    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );
    if (installationId) {
      const isDelete = await this.gitService.deleteGitOrganization(
        gitProvider,
        installationId
      );
      if (isDelete) {
        await this.prisma.gitOrganization.delete({
          where: {
            id: gitOrganizationId
          }
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
          id: gitOrganizationId
        }
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
              gitRepositoryOverride: false
            },
            {
              id: resourceId
            }
          ]
        }
      });

      resourcesToConnect = resources.map(r => ({ id: r.id }));
    } else {
      resourcesToConnect = [
        {
          id: resourceId
        }
      ];
    }
    return resourcesToConnect;
  }
}
