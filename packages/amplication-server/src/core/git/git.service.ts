import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FindOneArgs } from 'src/dto';
import { GitOrganization } from 'src/models/GitOrganization';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateGitRepositoryArgs } from './dto/args/CreateGitRepositoryArgs';
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
@Injectable()
export class GitService {
  constructor(
    private readonly gitServiceFactory: GitServiceFactory,
    private readonly prisma: PrismaService
  ) {}

  async getReposOfOrganization(args: GetReposListArgs): Promise<GitRepo[]> {
    const { gitProvider, gitOrganizationId } = args;
    const service = this.gitServiceFactory.getService(gitProvider);
    return await service.getOrganizationRepos(gitOrganizationId);
  }
  async createGitRepository(args: CreateGitRepositoryInput): Promise<GitRepo> {
    const provider = this.gitServiceFactory.getService(args.gitProvider);
    const newRepo = await provider.createRepo(args);

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
    return await service.createGitOrganization(args);
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
    await this.prisma.gitOrganization.delete({
      where: {
        id: gitOrganizationId
      }
    });

    await service.deleteGitOrganization(args.gitOrganizationId);
    return true;
  }
}
