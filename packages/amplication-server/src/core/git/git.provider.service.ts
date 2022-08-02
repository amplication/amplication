import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { PrismaService } from '@amplication/prisma-db';
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

const GIT_REPOSITORY_EXIST =
  'Git Repository already connected to an other Resource';
const INVALID_GIT_REPOSITORY_ID = 'Git Repository does not exist';

@Injectable()
export class GitProviderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gitService: GitService
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

  async createGitRepository(args: CreateGitRepositoryInput): Promise<Resource> {
    const organization = await this.getGitOrganization({
      where: {
        id: args.gitOrganizationId
      }
    });

    const repository = await this.gitService.createGitRepository(
      args.name,
      args.gitProvider,
      EnumGitOrganizationType[organization.type],
      organization.name,
      organization.installationId,
      args.public
    );

    if (!repository) {
      throw new AmplicationError(
        `Failed to create repository ${organization.name}\\${args.name}`
      );
    }

    return await this.connectResourceGitRepository({ ...args });
  }

  async deleteGitRepository(args: DeleteGitRepositoryArgs): Promise<Resource> {
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
    return await this.prisma.resource.findUnique({
      where: { id: gitRepository.resourceId }
    });
  }

  async connectResourceGitRepository({
    resourceId,
    name,
    gitOrganizationId
  }: ConnectGitRepositoryInput): Promise<Resource> {
    const gitRepo = await this.prisma.gitRepository.findUnique({
      where: { resourceId }
    });

    if (gitRepo) {
      throw new AmplicationError(GIT_REPOSITORY_EXIST);
    }

    await this.prisma.gitRepository.create({
      data: {
        name: name,
        resource: { connect: { id: resourceId } },
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
}
