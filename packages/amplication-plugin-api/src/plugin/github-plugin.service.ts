import { Inject, Injectable } from "@nestjs/common";
import { Plugin } from "../../prisma/generated-prisma-client";
import fetch from "node-fetch";
import yaml from "js-yaml";
import { PluginList, PluginYml } from "./plugin.types";
import { AMPLICATION_GITHUB_URL, emptyPlugin } from "./plugin.constants";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class GitPluginService {
  constructor(@Inject(AmplicationLogger) readonly logger: AmplicationLogger) {}
  /**
   * generator function to fetch each plugin yml and convert it to DB plugin structure
   * @param pluginList
   */
  async *getPluginConfig(
    pluginList: PluginList[]
  ): AsyncGenerator<PluginYml, void> {
    try {
      const pluginListLength = pluginList.length;
      let index = 0;

      do {
        const pluginUrl = pluginList[index].url;
        if (!pluginUrl)
          throw `Plugin ${pluginList[index].name} doesn't have url`;

        const response = await fetch(pluginUrl);
        const pluginConfig = await response.json();

        if (!pluginConfig && !pluginConfig.content) yield emptyPlugin;

        const fileContent = await Buffer.from(
          pluginConfig.content,
          "base64"
        ).toString();
        const fileYml: PluginYml = yaml.load(fileContent) as PluginYml;

        const pluginId = pluginList[index]["name"].replace(".yml", "");

        ++index;

        yield {
          ...fileYml,
          pluginId,
        };
      } while (pluginListLength > index);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
  /**
   * main function that fetch the catalog and trigger the generator in order to get each one of the plugins
   * @returns Plugin[]
   */
  async getPlugins(): Promise<Plugin[]> {
    try {
      const response = await fetch(AMPLICATION_GITHUB_URL);
      const pluginCatalog = await response.json();

      if (!pluginCatalog) throw "Failed to fetch github plugin catalog";

      const pluginsArr: Plugin[] = [];

      for await (const pluginConfig of this.getPluginConfig(pluginCatalog)) {
        if (!(pluginConfig as PluginYml).pluginId) continue;

        const currDate = new Date();
        pluginsArr.push({
          id: "",
          createdAt: currDate,
          description: pluginConfig.description,
          github: pluginConfig.github,
          icon: pluginConfig.icon,
          name: pluginConfig.name,
          npm: pluginConfig.npm,
          pluginId: pluginConfig.pluginId,
          website: pluginConfig.website,
          updatedAt: currDate,
        });
      }

      return pluginsArr;
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
