import {
  EnumPullRequestMode,
  GitClientService,
  File,
  GitProvidersConfiguration,
} from "@amplication/git-utils";
import { Env } from "../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiffService } from "../diff/diff.service";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";

@Injectable()
export class PullRequestService {
  gitProvidersConfiguration: GitProvidersConfiguration;
  constructor(
    private readonly diffService: DiffService,
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {
    const bitbucketClientId = this.configService.get<string>(
      Env.BITBUCKET_CLIENT_ID
    );
    const bitbucketClientSecret = this.configService.get<string>(
      Env.BITBUCKET_CLIENT_SECRET
    );
    const githubClientId = this.configService.get<string>(
      Env.GITHUB_APP_CLIENT_ID
    );
    const githubClientSecret = this.configService.get<string>(
      Env.GITHUB_APP_CLIENT_SECRET
    );
    const githubAppId = this.configService.get<string>(Env.GITHUB_APP_APP_ID);
    const githubAppPrivateKey = this.configService.get<string>(
      Env.GITHUB_APP_PRIVATE_KEY
    );
    const githubAppInstallationUrl = this.configService.get<string>(
      Env.GITHUB_APP_INSTALLATION_URL
    );

    this.gitProvidersConfiguration = {
      gitHubConfiguration: {
        clientId: githubClientId,
        clientSecret: githubClientSecret,
        appId: githubAppId,
        privateKey: githubAppPrivateKey,
        installationUrl: githubAppInstallationUrl,
      },
      bitBucketConfiguration: {
        clientId: bitbucketClientId,
        clientSecret: bitbucketClientSecret,
      },
    };
  }

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
    const gitClientService = await new GitClientService().create(
      {
        provider: gitProvider,
        providerOrganizationProperties: { installationId },
      },
      this.gitProvidersConfiguration,
      this.logger
    );
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
