import { Injectable } from '@nestjs/common';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
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
}
