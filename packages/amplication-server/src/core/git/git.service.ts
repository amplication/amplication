import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FindOneArgs } from 'src/dto';
import { GitOrganization } from 'src/models/GitOrganization';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GitOrganizationFindManyArgs } from './dto/args/GitOrganizationFindManyArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitServiceFactory } from './utils/GitServiceFactory/GitServiceFactory';
import { GitRepository } from 'src/models/GitRepository';
import { AmplicationError } from 'src/errors/AmplicationError';
import { GIT_REPOSITORY_EXIST } from './constants';

@Injectable()
export class GitService {
  constructor(
    private readonly gitServiceFactory: GitServiceFactory,
    private readonly prisma: PrismaService
  ) {}

  async getReposOfOrganization(args: GetReposListArgs): Promise<GitRepo[]> {
    const { sourceControlService, gitOrganizationId } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getOrganizationRepos(gitOrganizationId);
  }
  async createRepo(args: CreateRepoArgs): Promise<GitRepo> {
    const { input, gitOrganizationId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const newRepo = await service.createRepo({
      gitOrganizationId,
      input: input
    });

    await this.createGitRepository(newRepo.name,
                                   input.appId,
                                   gitOrganizationId);

    return newRepo;

  }

  async createGitRepository(
    name: string, appId:string, gitOrganizationId:string
  ): Promise<GitRepository> {
    const gitRepo = await this.prisma.gitRepository.findFirst({
      where:{
        name:name
      }
    }); 

    if(gitRepo) {
      throw new AmplicationError(GIT_REPOSITORY_EXIST);
    }
    
    return await this.prisma.gitRepository.create({
      data: {
        name: name,
        appId:appId,
        gitOrganizationId:gitOrganizationId
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

  async deleteGitOrganization(args: BaseGitArgs): Promise<boolean> {
    const { sourceControlService, gitOrganizationId } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    await this.prisma.gitOrganization.delete({
      where: {
        id: gitOrganizationId
      }
    });

    await service.deleteGitOrganization(args.gitOrganizationId);
    return true;
  }
}
