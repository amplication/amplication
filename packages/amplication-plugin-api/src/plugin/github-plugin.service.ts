import { Inject, Injectable } from "@nestjs/common";
import { Plugin } from "../../prisma/generated-prisma-client";
import fetch from "node-fetch";
import yaml from "js-yaml";
import {
  NpmDownloads,
  NpmTags,
  PluginData,
  PluginList,
  PluginCatalogEntryYml,
} from "./plugin.types";
import { AMPLICATION_GITHUB_URL, emptyPlugin } from "./plugin.constants";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { NpmService } from "../npm/npm.service";
import { isArray } from "lodash";

const GENERATOR_PROPERTY_TO_GENERATOR_NAME = {
  ["data-service-generator"]: "NodeJs",
  ["generator-dotnet-webapi"]: "DotNet",
  nodejs: "NodeJs",
  dotnet: "DotNet",
};

@Injectable()
export class GitPluginService {
  private githubHeaders: any;
  constructor(
    @Inject(AmplicationLogger) readonly logger: AmplicationLogger,
    configService: ConfigService,
    readonly npmService: NpmService
  ) {
    const githubToken = configService.get("GITHUB_TOKEN");
    if (!githubToken) {
      this.logger.error("Github token is missing");
    }
    this.githubHeaders = githubToken
      ? // eslint-disable-next-line @typescript-eslint/naming-convention
        { Authorization: `token ${githubToken}` }
      : {};
  }

  async fetchNpmData(
    npm: string,
    pluginId: string
  ): Promise<{
    npm: NpmTags;
    downloads: number;
  }> {
    const npmData = {
      npm: {},
      downloads: 0,
    };

    try {
      const npmResponse = await Promise.allSettled([
        this.npmService.fetchPackagePackument(npm),
        this.npmService.fetchPackageDownloads(npm),
      ]);

      npmResponse.forEach((res, index) => {
        if (res.status === "rejected") {
          this.logger.error(
            index === 0
              ? `Plugin ${pluginId} doesn't have npm versions`
              : `Plugin ${pluginId} failed to fetch downloads`,
            null,
            {
              [index === 0 ? "npmVersions" : "npmDownloads"]: res.reason,
            }
          );
          return;
        }
        if (index === 0) npmData.npm = res.value;

        if (index === 1)
          npmData.downloads = (res.value as NpmDownloads).downloads;
      });
      return npmData;
    } catch (error) {
      this.logger.error("Failed to get npm data (versions & downloads)", error);
      return npmData;
    }
  }
  /**
   * generator function to fetch each plugin yml and convert it to DB plugin structure
   * @param pluginList
   */
  async *getPluginConfig(
    pluginList: PluginList[]
  ): AsyncGenerator<PluginData, void> {
    try {
      const pluginListLength = pluginList.length;
      let index = 0;

      do {
        const pluginUrl = pluginList[index].download_url;
        if (!pluginUrl) {
          throw `Plugin ${pluginList[index].name} doesn't have download_url`;
        }

        const response = await fetch(pluginUrl, {
          headers: this.githubHeaders,
        });

        if (!response?.ok) {
          this.logger.error("Failed to fetch github plugin catalog", null, {
            response,
          });
          yield emptyPlugin;
          ++index;
          continue;
        }

        const pluginConfig = await response.text();

        const fileYml = yaml.load(pluginConfig) as PluginCatalogEntryYml;

        const pluginId = pluginList[index]["name"].replace(".yml", "");

        const npmData = await this.fetchNpmData(fileYml.npm, fileYml.pluginId);

        ++index;

        yield {
          pluginCatalogEntry: {
            ...fileYml,
            pluginId,
          },
          npm: npmData.npm,
          downloads: npmData.downloads,
        };
      } while (pluginListLength > index);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  getGeneratorNameFromGeneratorProperty(generator: string[] | string): string {
    const generatorProperty = isArray(generator) ? generator[0] : generator;
    const translatedGeneratorName =
      GENERATOR_PROPERTY_TO_GENERATOR_NAME[generatorProperty];
    if (!translatedGeneratorName) {
      return generatorProperty;
    }
    return translatedGeneratorName;
  }

  /**
   * main function that fetch the catalog and trigger the generator in order to get each one of the plugins
   * @returns Plugin[]
   */
  async getPlugins(): Promise<Plugin[]> {
    try {
      const response = await fetch(AMPLICATION_GITHUB_URL, {
        headers: this.githubHeaders,
      });

      const pluginCatalog = await response.json();

      if (!response?.ok) {
        if (response.headers.get("x-ratelimit-remaining") === "0") {
          this.logger.error("Github rate limit exceeded", null, {
            responseHeaders: response.headers.raw(),
          });
        }
        throw new Error("Failed to fetch github plugin catalog");
      }
      const pluginsArr: Plugin[] = [];

      for await (const pluginConfig of this.getPluginConfig(pluginCatalog)) {
        if (!(pluginConfig as PluginData).pluginCatalogEntry.pluginId) continue;

        const { npm, pluginCatalogEntry, downloads } = pluginConfig;
        pluginsArr.push({
          id: undefined,
          createdAt: npm.time ? new Date(npm.time.created) : new Date(),
          description: pluginCatalogEntry.description,
          github: pluginCatalogEntry.github,
          icon: pluginCatalogEntry.icon,
          name: pluginCatalogEntry.name,
          npm: pluginCatalogEntry.npm,
          pluginId: pluginCatalogEntry.pluginId,
          taggedVersions: npm["dist-tags"],
          website: pluginCatalogEntry.website,
          updatedAt: npm.time ? new Date(npm.time.modified) : new Date(),
          downloads: downloads,
          categories: pluginCatalogEntry.categories,
          codeGeneratorName: this.getGeneratorNameFromGeneratorProperty(
            pluginCatalogEntry.generator
          ),
        });
      }

      return pluginsArr;
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
