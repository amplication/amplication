import { TraceWrapper, Traceable } from "@amplication/opentelemetry-nestjs";
import {
  DownloadPrivatePluginsRequest,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import {
  GitClientService,
  GitProvidersConfiguration,
} from "@amplication/util/git";
import { LogLevel } from "@amplication/util/logging";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { copy, pathExists } from "fs-extra";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "path";
import { Env } from "../env";

@Traceable()
@Injectable()
export class PrivatePluginService {
  gitProvidersConfiguration: GitProvidersConfiguration;

  constructor(
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly producerService: KafkaProducerService
  ) {
    const bitbucketClientId = this.configService.get<string>(
      Env.BITBUCKET_CLIENT_ID
    );
    const bitbucketClientSecret = this.configService.get<string>(
      Env.BITBUCKET_CLIENT_SECRET
    );
    const gitLabClientId = this.configService.get<string>(Env.GITLAB_CLIENT_ID);
    const gitLabClientSecret = this.configService.get<string>(
      Env.GITLAB_CLIENT_SECRET
    );
    const gitLabRedirectUri = this.configService.get<string>(
      Env.GITLAB_REDIRECT_URI
    );

    const azureDevopsClientId = this.configService.get<string>(
      Env.AZURE_DEVOPS_CLIENT_ID
    );
    const azureDevopsClientSecret = this.configService.get<string>(
      Env.AZURE_DEVOPS_CLIENT_SECRET
    );
    const azureDevopsRedirectUri = this.configService.get<string>(
      Env.AZURE_DEVOPS_REDIRECT_URI
    );
    const azureDevopsTenantId = this.configService.get<string>(
      Env.AZURE_DEVOPS_TENANT_ID
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
      gitLabConfiguration: {
        clientId: gitLabClientId,
        clientSecret: gitLabClientSecret,
        redirectUri: gitLabRedirectUri,
      },
      azureDevopsConfiguration: {
        clientId: azureDevopsClientId,
        clientSecret: azureDevopsClientSecret,
        tenantId: azureDevopsTenantId,
        redirectUri: azureDevopsRedirectUri,
      },
    };
  }

  private async log(
    buildId: string,
    level: LogLevel,
    message: string
  ): Promise<void> {
    await this.producerService.emitMessage(
      KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_LOG_TOPIC,
      {
        key: {
          buildId,
        },
        value: {
          buildId,
          level,
          message,
        },
      }
    );
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
    pluginsToDownload,
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
    const cloneDirPath = join(
      this.configService.get<string>(Env.CLONES_FOLDER),
      "private-plugins"
    );
    const { pluginPaths, pluginVersions, cleanupPaths } =
      await gitClientService.downloadPrivatePlugins({
        owner,
        repositoryName: repo,
        repositoryGroupName,
        resourceId,
        buildId,
        baseBranchName,
        cloneDirPath,
        pluginsToDownload,
      });

    pluginVersions.forEach(async (pluginVersion) => {
      await this.log(
        buildId,
        LogLevel.Info,
        `Downloaded plugin: ${pluginVersion}`
      );
    });

    const { newPluginPaths } = await this.copyPluginFilesToDsgAssetsDir(
      pluginPaths,
      resourceId,
      buildId
    );
    await this.cleanupPluginsDir(cleanupPaths);

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

      const pathExist = await pathExists(pluginPath);
      if (!pathExist) {
        throw new Error(
          `Can't find plugin '${pluginName}' in the source repository`
        );
      }
      await copy(pluginPath, pluginPathInAssets);
      newPluginPaths.push(pluginPathInAssets);
    }

    return { newPluginPaths };
  }
  async cleanupPluginsDir(cleanupPaths: string[]): Promise<void> {
    for (const path of cleanupPaths) {
      if (existsSync(path)) {
        await rm(path, {
          recursive: true,
          force: true,
          maxRetries: 3,
        }).catch((error) => {
          this.logger.error(
            `Failed to delete private plugins repository dir`,
            error,
            {
              repositoryDir: path,
            }
          );
        });
      }
    }
  }
}
