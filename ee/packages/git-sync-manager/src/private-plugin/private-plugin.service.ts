import {
  GitClientService,
  GitProvidersConfiguration,
} from "@amplication/util/git";
import { Env } from "../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DownloadPrivatePluginsRequest } from "@amplication/schema-registry";
import { TraceWrapper, Traceable } from "@amplication/opentelemetry-nestjs";
import { copy } from "fs-extra";
import { join } from "path";

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

  async downloadPrivatePlugins({
    resourceId,
    buildId,
    gitProvider,
    gitProviderProperties,
    gitOrganizationName: owner,
    gitRepositoryName: repo,
    repositoryGroupName,
    baseBranchName,
    pluginIds,
  }: DownloadPrivatePluginsRequest.Value): Promise<{
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
    const cloneDirPath = this.configService.get<string>(Env.CLONES_FOLDER);
    const { pluginPaths } = await gitClientService.downloadPrivatePlugins({
      owner,
      repositoryName: repo,
      repositoryGroupName,
      resourceId,
      buildId,
      baseBranchName,
      cloneDirPath,
      pluginIds,
    });

    const { newPluginPaths } = await this.copyPluginFilesToDsgAssetsDir(
      pluginPaths,
      resourceId,
      buildId
    );
    return { pluginPaths: newPluginPaths };
  }

  async copyPluginFilesToDsgAssetsDir(
    pluginPaths: string[],
    resourceId: string,
    buildId: string
  ): Promise<{ newPluginPaths: string[] }> {
    const dsgAssetsPath = join(
      this.configService.get(Env.DSG_ASSETS_FOLDER),
      `${resourceId}-${buildId}`,
      "private-plugins"
    );

    const newPluginPaths: string[] = [];
    for (const pluginPath of pluginPaths) {
      const pluginName = pluginPath.split("/").pop();
      const pluginPathInAssets = join(dsgAssetsPath, pluginName);
      await copy(pluginPath, pluginPathInAssets);
      newPluginPaths.push(pluginPathInAssets);
    }

    return { newPluginPaths };
  }
}
