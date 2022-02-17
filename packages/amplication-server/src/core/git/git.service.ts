import { Injectable } from '@nestjs/common';
import { GitOrganization } from 'src/models/GitOrganization';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitUser } from './dto/objects/GitUser';
import { GitServiceFactory } from './utils/GitServiceFactory/GitServiceFactory';

@Injectable()
export class GitService {
  constructor(private readonly gitServiceFactory: GitServiceFactory) {}

  async getReposOfUser(args: GetReposListArgs): Promise<GitRepo[]> {
    const { sourceControlService, appId } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const token = await service.tokenExtractor.getTokenFromDb(appId);
    return await service.getUserRepos(token);
  }
  async createRepo(args: CreateRepoArgs): Promise<GitRepo> {
    const { input, appId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const token = await service.tokenExtractor.getTokenFromDb(appId);
    return await service.createRepo({
      token,
      input: input
    });
  }

  async getUsername(args: BaseGitArgs): Promise<string> {
    return (await this.getUser(args)).username;
  }
  async getUser(args: BaseGitArgs): Promise<GitUser> {
    const { appId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const token = await service.tokenExtractor.getTokenFromDb(appId);
    return await service.getUser(token);
  }

  async createGitOrganization(args:CreateGitOrganizationArgs):Promise<GitOrganization>{
    const { sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.createGitOrganization(args);
  }

  async getGitOrganization(args:BaseGitArgs):Promise<GitOrganization> {
    const { sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getGitOrganization(args.appId); //todo: need to change to organizationId 
  }

  async getGithubAppInstallationUrl(args:BaseGitArgs):Promise<string>{
    const { sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getGithubAppInstallationUrl();
  } 

  async deleteGitOrganization(args:BaseGitArgs):Promise<boolean>{
    const { sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.deleteGitOrganization(args.appId); //todo: need to change to organizationId 
  }
}
