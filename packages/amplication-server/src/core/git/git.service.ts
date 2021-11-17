import { Injectable } from '@nestjs/common';
import { AppService } from '..';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitUser } from './dto/objects/GitUser';
import { GitServiceFactory } from './utils/GitServiceFactory/GitServiceFactory';
import { TokenFactory } from './utils/TokenFactory/TokenFactory';

//TODO export the switch to a factory be this logic https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html
@Injectable()
export class GitService {
  private readonly tokenFactory: TokenFactory;
  constructor(
    private readonly gitServiceFactory: GitServiceFactory,
    appService: AppService
  ) {
    this.tokenFactory = new TokenFactory(appService);
  }

  async getReposOfUser(args: GetReposListArgs): Promise<GitRepo[]> {
    const { sourceControlService, appId } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const githubToken = await this.tokenFactory.getTokenFromApp(appId);
    return await service.getUserRepos(githubToken);
  }
  async createRepo(args: CreateRepoArgs): Promise<GitRepo> {
    const { input, appId, sourceControlService } = args;
    const service = this.gitServiceFactory.getService(sourceControlService);
    const githubToken = await this.tokenFactory.getTokenFromApp(appId);
    return await service.createRepo({
      token: githubToken,
      input: input
    });
  }

  async getUsername(args: BaseGitArgs): Promise<string> {
    return (await this.getUser(args)).username;
  }
  async getUser(args: BaseGitArgs): Promise<GitUser> {
    const { appId, sourceControlService } = args;
    const githubToken = await this.tokenFactory.getTokenFromApp(appId);
    const service = this.gitServiceFactory.getService(sourceControlService);
    return await service.getUser(githubToken);
  }
}
