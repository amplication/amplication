import {
  EnumPullRequestMode,
  GitClientService,
  File,
} from "@amplication/git-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { DiffService } from "../diff/diff.service";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";

@Injectable()
export class PullRequestService {
  constructor(
    private readonly diffService: DiffService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  async createPullRequest({
    resourceId,
    oldBuildId,
    newBuildId,
    installationId,
    gitProvider,
    gitOrganizationName: owner,
    gitRepositoryName: repo,
    commit,
    gitResourceMeta,
    pullRequestMode,
  }: CreatePullRequestArgs): Promise<string> {
    const { body, title } = commit;
    const head =
      commit.head || pullRequestMode === EnumPullRequestMode.Accumulative
        ? "amplication"
        : `amplication-build-${newBuildId}`;
    const changedFiles = await this.diffService.listOfChangedFiles(
      resourceId,
      oldBuildId,
      newBuildId
    );

    this.logger.info(
      "The changed files have returned from the diff service listOfChangedFiles are",
      { lengthOfFile: changedFiles.length }
    );
    const gitClientService = await new GitClientService().create({
      provider: gitProvider,
      installationId,
    });
    const prUrl = await gitClientService.createPullRequest({
      owner,
      repositoryName: repo,
      branchName: head,
      commitMessage: commit.body,
      pullRequestTitle: title,
      pullRequestBody: body,
      pullRequestMode,
      gitResourceMeta,
      files: PullRequestService.removeFirstSlashFromPath(changedFiles),
    });
    this.logger.info("Opened a new pull request", { prUrl });
    return prUrl;
  }

  private static removeFirstSlashFromPath(changedFiles: File[]): File[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp("^/"), "") };
    });
  }
}
