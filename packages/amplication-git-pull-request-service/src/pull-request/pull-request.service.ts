import { GitService } from "@amplication/git-utils";
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import { Inject, Injectable } from "@nestjs/common";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";
import { DiffService } from "../diff/diff.service";
import { PrModule } from "../types";
import { EnumGitProvider } from "../models";

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
    gitOrganizationName,
    gitRepositoryName,
    installationId,
    commit,
    gitProvider,
    gitResourceMeta,
    smartStrategy,
  }: CreatePullRequestArgs): Promise<string> {
    const { base, body, head, title } = commit;
    const changedFiles = await this.diffService.listOfChangedFiles(
      resourceId,
      oldBuildId,
      newBuildId
    );

    this.logger.info(
      "The changed files has return from the diff service listOfChangedFiles",
      { lengthOfFile: changedFiles.length }
    );

    if (base) {
      await this.enforceBranchExist(
        gitProvider,
        installationId,
        gitOrganizationName,
        gitRepositoryName,
        base
      );
    }

    const prUrl = await this.gitService.createPullRequest(
      gitProvider,
      gitOrganizationName,
      gitRepositoryName,
      PullRequestService.removeFirstSlashFromPath(changedFiles),
      head,
      title,
      body,
      installationId,
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

  async enforceBranchExist(
    gitProvider: EnumGitProvider,
    installationId: string,
    gitOrganizationName: string,
    gitRepositoryName: string,
    branch: string
  ) {
    const { defaultBranch } = await await this.gitService.getRepository(
      gitProvider,
      installationId,
      gitOrganizationName,
      gitRepositoryName
    );

    const isBranchExist = await this.gitService.isBranchExist(
      gitProvider,
      installationId,
      gitOrganizationName,
      gitRepositoryName,
      branch
    );

    if (!isBranchExist) {
      console.info(`Creating new branch ${branch}`);

      await this.gitService.createBranch(
        gitProvider,
        installationId,
        gitOrganizationName,
        gitRepositoryName,
        branch,
        defaultBranch
      );
    }
  }
}
