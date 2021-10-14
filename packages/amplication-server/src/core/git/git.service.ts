import { Injectable } from '@nestjs/common';
import { AppService } from '..';
import { GithubService } from '../github/github.service';
import { CreateRepoArgs } from './dto/args/CreateRepoArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { EnumSourceControlService } from './dto/enums/EnumSourceControlService';
import { GitRepo } from './dto/objects/GitRepo';

@Injectable()
export class GitService {
  constructor(
    private readonly githubService: GithubService,
    private readonly appService: AppService
  ) {}
  async getReposOfUser(args: GetReposListArgs): Promise<GitRepo[]> {
    const app = await this.appService.app({ where: { id: args.appId } });
    switch (args.sourceControlService) {
      case EnumSourceControlService.Github:
        return await this.githubService.getUserRepos(app.githubToken);
      default:
        throw new Error("Didn't get a valid git service");
    }
  }

  async createRepoInOrg(args: CreateRepoArgs): Promise<GitRepo> {
    const app = await this.appService.app({ where: { id: args.appId } });
    const token = app.githubToken;
    const { sourceControlService } = args;
    switch (sourceControlService) {
      case EnumSourceControlService.Github:
        return this.githubService.createRepo({ token, input: args.input });

      default:
        break;
    }
  }
}
