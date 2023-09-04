import {
  EnumPullRequestMode,
  GitClientService,
  File,
  GitProvidersConfiguration,
} from "@amplication/util/git";
import { Env } from "../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiffService } from "../diff/diff.service";
import { CreatePrRequest } from "@amplication/schema-registry";
import { TraceWrapper, Traceable } from "@amplication/opentelemetry-nestjs";

@Traceable()
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
    resourceName,
    oldBuildId,
    newBuildId,
    gitProvider,
    gitProviderProperties,
    gitOrganizationName: owner,
    gitRepositoryName: repo,
    commit,
    gitResourceMeta,
    pullRequestMode,
    repositoryGroupName,
    baseBranchName,
    isBranchPerResource,
  }: CreatePrRequest.Value): Promise<string> {
    const logger = this.logger.child({ resourceId, buildId: newBuildId });
    const { body, title } = commit;

    let head = null;

    if (pullRequestMode === EnumPullRequestMode.Accumulative) {
      if (isBranchPerResource) {
        head = `amplication-${resourceName}`;
      } else {
        head = `amplication`;
      }
    } else {
      head = `amplication-build-${newBuildId}`;
    }

    const changedFiles = await this.diffService.listOfChangedFiles(
      resourceId,
      oldBuildId,
      newBuildId
    );

    logger.info(
      "The changed files have returned from the diff service listOfChangedFiles are",
      {
        lengthOfFile: changedFiles.length,
      }
    );

    const gitClientService = TraceWrapper.trace(
      await new GitClientService().create(
        {
          provider: gitProvider,
          providerOrganizationProperties: gitProviderProperties,
        },
        this.gitProvidersConfiguration,
        logger
      ),
      { logger }
    );
    const cloneDirPath = this.configService.get<string>(Env.CLONES_FOLDER);

    const prUrl = await gitClientService.createPullRequest({
      owner,
      cloneDirPath,
      repositoryName: repo,
      repositoryGroupName,
      branchName: head,
      commitMessage: body,
      pullRequestTitle: title,
      pullRequestBody: body,
      pullRequestMode,
      gitResourceMeta,
      files: PullRequestService.removeFirstSlashFromPath(changedFiles),
      resourceId,
      buildId: newBuildId,
      baseBranchName,
    });

    logger.info("Opened a new pull request", { prUrl });
    return prUrl;
  }

  private static removeFirstSlashFromPath(changedFiles: File[]): File[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp("^/"), "") };
    });
  }
}
