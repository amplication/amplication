import { Injectable } from '@nestjs/common';
import { AppService } from '..';
import { GithubService } from '../github/github.service';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { EnumSourceControlService } from './dto/enums/EnumSourceControlService';
import { GitRepo } from './dto/objects/GitRepo';
import { isEmpty } from 'lodash';
import { INVALID_APP_ID } from '../app/app.service';

@Injectable()
export class GitService {
  constructor(
    private readonly githubService: GithubService,
    private readonly appService: AppService
  ) {}
  async getReposOfUser(args: GetReposListArgs): Promise<GitRepo[]> {
    const app = await this.appService.app({ where: { id: args.appId } });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (isEmpty(app.githubToken)) {
      throw new Error(
        `Sync cannot be enabled since this app is not authorized with any GitHub repo. You should first complete the authorization process`
      );
    }
    switch (args.sourceControlService) {
      case EnumSourceControlService.Github:
        return await this.githubService.getUserRepos(app.githubToken);
      default:
        throw new Error("Didn't get a valid git service");
    }
  }
  //TODO add args validation
  //TODO add make sure repo name valid
  async createRepoInOrg(args: CreateRepoArgs): Promise<GitRepo> {
    const { input, appId, sourceControlService } = args;
    const app = await this.appService.app({ where: { id: appId } });
    const token = app.githubToken;

    switch (sourceControlService) {
      case EnumSourceControlService.Github:
        return this.githubService.createRepo({ token, input: input });
      default:
        throw new Error("didn't get a valid source control");
    }
  }
}
