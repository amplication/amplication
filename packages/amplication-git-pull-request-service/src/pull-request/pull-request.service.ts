import {
  EnumPullRequestMode,
  GitFactory,
  PullRequestModule,
} from "@amplication/git-utils";
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import { Inject, Injectable } from "@nestjs/common";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { DiffService } from "../diff/diff.service";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";

@Injectable()
export class PullRequestService {
  constructor(
    private readonly diffService: DiffService,
    protected readonly gitFactory: GitFactory,
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
    const gitClient = this.gitFactory.getProvider({ provider: gitProvider });
    const prUrl = await gitClient.createPullRequest({
      pullRequestMode,
      owner,
      repositoryUrl: repo,
      files: PullRequestService.removeFirstSlashFromPath(changedFiles),
      pullRequestTitle: title,
      pullRequestBody: body,
      installationId,
      head,
      gitResourceMeta,
    });
    this.logger.info("Opened a new pull request", { prUrl });
    return prUrl;
  }

  private static removeFirstSlashFromPath(
    changedFiles: PullRequestModule[]
  ): PullRequestModule[] | Required<Changes["files"]> {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp("^/"), "") };
    });
  }
}
