import { Injectable } from '@nestjs/common';
import { AppService } from '..';
import { GithubService } from '../github/github.service';
import { BaseGitArgs } from './dto/args/BaseGitArgs';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { EnumSourceControlService } from './dto/enums/EnumSourceControlService';
import { GitRepo } from './dto/objects/GitRepo';
import { GitUser } from './dto/objects/GitUser';
import { INVALID_SOURCE_CONTROL_ERROR } from './errors/InvalidSourceControlError';
import { TokenFactory } from './utils/TokenFactory';

@Injectable()
export class GitService {
  private readonly tokenFactory: TokenFactory;
  constructor(
    private readonly githubService: GithubService,
    appService: AppService
  ) {
    this.tokenFactory = new TokenFactory(appService);
  }

  async getReposOfUser(args: GetReposListArgs): Promise<GitRepo[]> {
    const githubToken = await this.tokenFactory.getTokenFromApp(args.appId);

    switch (args.sourceControlService) {
      case EnumSourceControlService.Github:
        return await this.githubService.getUserRepos(githubToken);
      default:
        throw INVALID_SOURCE_CONTROL_ERROR;
    }
  }
  async createRepo(args: CreateRepoArgs): Promise<GitRepo> {
    const { input, appId, sourceControlService } = args;
    const githubToken = await this.tokenFactory.getTokenFromApp(appId);

    switch (sourceControlService) {
      case EnumSourceControlService.Github:
        return this.githubService.createRepo({
          token: githubToken,
          input: input
        });
      default:
        throw INVALID_SOURCE_CONTROL_ERROR;
    }
  }

  async getUsername(args: BaseGitArgs): Promise<string> {
    const { appId, sourceControlService } = args;
    const githubToken = await this.tokenFactory.getTokenFromApp(appId);

    switch (sourceControlService) {
      case EnumSourceControlService.Github:
        return (await this.githubService.getUser(githubToken)).username;
      default:
        throw INVALID_SOURCE_CONTROL_ERROR;
    }
  }
  async getUser(args: BaseGitArgs): Promise<GitUser> {
    const { appId, sourceControlService } = args;
    const githubToken = await this.tokenFactory.getTokenFromApp(appId);

    switch (sourceControlService) {
      case EnumSourceControlService.Github:
        return await this.githubService.getUser(githubToken);
      default:
        throw INVALID_SOURCE_CONTROL_ERROR;
    }
  }
}
