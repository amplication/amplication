import { Branch, GitService } from "@amplication/git-utils";
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import { Inject, Injectable } from "@nestjs/common";
import { DiffService } from "../diff/diff.service";
import { EnumGitProvider } from "../models";
import { PrModule } from "../types";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";

@Injectable()
export class PullRequestService {
  constructor(
    private readonly diffService: DiffService,
    protected readonly gitService: GitService,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}

  async createPullRequest({
    resourceId,
    oldBuildId,
    newBuildId,
    gitOrganizationName: owner,
    gitRepositoryName: repo,
    installationId,
    commit,
    gitProvider,
    gitResourceMeta,
    pullRequestMode,
  }: CreatePullRequestArgs): Promise<string> {
    const { base, body, head, title } = commit;
    const changedFiles = await this.diffService.listOfChangedFiles(
      resourceId,
      oldBuildId,
      newBuildId
    );

    this.logger.info(
      "The changed files have returned from the diff service listOfChangedFiles are",
      { lengthOfFile: changedFiles.length }
    );

    await this.validateOrCreateBranch(
      gitProvider,
      installationId,
      owner,
      repo,
      head
    );

    const prUrl = await this.gitService.createPullRequest(
      pullRequestMode,
      gitProvider,
      owner,
      repo,
      PullRequestService.removeFirstSlashFromPath(changedFiles),
      head,
      title,
      body,
      installationId,
      head,
      gitResourceMeta,
      base
    );
    this.logger.info("Opened a new pull request", { prUrl });
    return prUrl;
  }

  private static removeFirstSlashFromPath(
    changedFiles: PrModule[]
  ): PrModule[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp("^/"), "") };
    });
  }

  async validateOrCreateBranch(
    gitProvider: EnumGitProvider,
    installationId: string,
    owner: string,
    repo: string,
    branch: string
  ): Promise<Branch> {
    const { defaultBranch } = await await this.gitService.getRepository(
      gitProvider,
      installationId,
      owner,
      repo
    );

    const isBranchExist = await this.gitService.isBranchExist(
      gitProvider,
      installationId,
      owner,
      repo,
      branch
    );

    if (!isBranchExist) {
      return this.gitService.createBranch(
        gitProvider,
        installationId,
        owner,
        repo,
        branch,
        defaultBranch
      );
    }

    return this.gitService.getBranch(
      gitProvider,
      installationId,
      owner,
      repo,
      branch
    );
  }
}
