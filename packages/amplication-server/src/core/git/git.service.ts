import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FindOneArgs } from 'src/dto';
import { GitOrganization } from 'src/models/GitOrganization';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { GitOrganizationFindManyArgs } from './dto/args/GitOrganizationFindManyArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitServiceFactory } from './utils/GitServiceFactory/GitServiceFactory';
import { GitRepository } from 'src/models/GitRepository';
import { AmplicationError } from 'src/errors/AmplicationError';
import { GIT_REPOSITORY_EXIST, INVALID_GIT_REPOSITORY_ID } from './constants';
import { isEmpty } from 'lodash';
import { DeleteGitRepositoryArgs } from './dto/args/DeleteGitRepositoryArgs';
import { DeleteGitOrganizationArgs } from './dto/args/DeleteGitOrganizationArgs';
import { ConnectGitRepositoryInput } from './dto/inputs/ConnectGitRepositoryInput';
import { CreateGitRepositoryInput } from './dto/inputs/CreateGitRepositoryInput';
import { CreateGitRemoteRepoInput } from './dto/inputs/CreateGitRemoteRepoInput';
@Injectable()
export class GitService {
  constructor(
    private readonly gitServiceFactory: GitServiceFactory,
    private readonly prisma: PrismaService
  ) {}

  async getReposOfOrganization(args: GetReposListArgs): Promise<GitRepo[]> {
    const { gitProvider, gitOrganizationId } = args;
    const service = this.gitServiceFactory.getService(gitProvider);
    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );
    return await service.getOrganizationRepos(installationId);
  }
  async createGitRepository(args: CreateGitRepositoryInput): Promise<GitRepo> {
    const provider = this.gitServiceFactory.getService(args.gitProvider);
    const installationId = await this.getInstallationIdByGitOrganizationId(
      args.gitOrganizationId
    );
    const createGitRemoteRepoInput = new CreateGitRemoteRepoInput();
    (createGitRemoteRepoInput.installationId = installationId.toString()),
      (createGitRemoteRepoInput.name = args.name);
    const newRepo = await provider.createRepo(createGitRemoteRepoInput);
    await this.connectGitRepository({ ...args });

    return newRepo;
  }

  async deleteGitRepository(args: DeleteGitRepositoryArgs): Promise<boolean> {
    const gitRepository = await this.prisma.gitRepository.findFirst({
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

  async connectGitRepository({
    appId,
    name,
    gitOrganizationId
  }: ConnectGitRepositoryInput): Promise<GitRepository> {
    const gitRepo = await this.prisma.gitRepository.findFirst({
      where: {
        name: name
      }
    });

    if (gitRepo) {
      throw new AmplicationError(GIT_REPOSITORY_EXIST);
    }

    return await this.prisma.gitRepository.create({
      data: {
        name: name,
        app: { connect: { id: appId } },
        gitOrganization: { connect: { id: gitOrganizationId } }
      }
    });
  }
  async createGitOrganization(
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    const { provider } = args.data;
    const service = this.gitServiceFactory.getService(provider);

    const gitOrganizationName = await service.getGitOrganizationName(
      args.data.installationId
    );

    const gitOrganization = await this.prisma.gitOrganization.findFirst({
      where: {
        name: gitOrganizationName
      }
    });

    if (gitOrganization) {
      return await this.prisma.gitOrganization.update({
        where: {
          id: gitOrganization.id
        },
        data: {
          ...args.data,
          installationId: args.data.installationId,
          name: gitOrganizationName
        }
      });
    }

    return await this.prisma.gitOrganization.create({
      data: {
        ...args.data,
        installationId: args.data.installationId,
        name: gitOrganizationName
      }
    });
  }

  async getGitOrganizations(
    args: GitOrganizationFindManyArgs
  ): Promise<GitOrganization[]> {
    return await this.prisma.gitOrganization.findMany(args);
  }

  async getGitOrganization(args: FindOneArgs): Promise<GitOrganization> {
    return await this.prisma.gitOrganization.findFirst(args);
  }

  async getGitInstallationUrl(
    args: GetGitInstallationUrlArgs
  ): Promise<string> {
    const { sourceControlService, workspaceId } = args.data;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getGitInstallationUrl(workspaceId);
  }

  async deleteGitOrganization(
    args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    const { gitProvider, gitOrganizationId } = args;
    const service = this.gitServiceFactory.getService(gitProvider);
    const installationId = await this.getInstallationIdByGitOrganizationId(
      gitOrganizationId
    );
    await service.deleteGitOrganization(installationId);
    await this.prisma.gitOrganization.delete({
      where: {
        id: gitOrganizationId
      }
    });
    return true;
  }

  private async getInstallationIdByGitOrganizationId(
    gitOrganizationId: string
  ): Promise<number | null> {
    return parseInt(
      (
        await this.prisma.gitOrganization.findFirst({
          where: {
            id: gitOrganizationId
          }
        })
      ).installationId
    );
  }
}
