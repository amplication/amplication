import {
  GitClientService,
  GitProvidersConfiguration,
} from "@amplication/util/git";
import { Env } from "../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PullPrivatePluginsRequest } from "@amplication/schema-registry";
import { TraceWrapper, Traceable } from "@amplication/opentelemetry-nestjs";

@Traceable()
@Injectable()
export class PrivatePluginService {
  gitProvidersConfiguration: GitProvidersConfiguration;

  constructor(
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

  async pullPrivatePlugin({
    resourceId,
    resourceName,
    gitProvider,
    gitProviderProperties,
    gitOrganizationName: owner,
    gitRepositoryName: repo,
    repositoryGroupName,
    baseBranchName,
    pluginIds,
  }: PullPrivatePluginsRequest.Value): Promise<{
    pluginPaths: string[];
  }> {
    const logger = this.logger.child({ resourceId });
    const gitClientService = TraceWrapper.trace(
      await new GitClientService().create(
        {
          provider: gitProvider,
          providerOrganizationProperties: gitProviderProperties,
        },
        this.gitProvidersConfiguration,
        logger
      ),
      {
        logger,
        attributes: {
          resourceId,
          gitProvider,
        },
      }
    );
    const { pluginPaths } = await gitClientService.pullPrivatePlugins({
      repositoryName: repo,
      repositoryGroupName,
      resourceId,
      baseBranchName,
      cloneDirPath: "", //TODO: complate this path,
      pluginIds,
    });
    return { pluginPaths };
  }
}
