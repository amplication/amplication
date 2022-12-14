import { Injectable } from "@nestjs/common";
import {
  Plugin,
  PluginVersion,
} from "@amplication/prisma-clients/amplication-plugin-api";
import fetch from "node-fetch";

interface NpmVersion {
  [versionNumber: string]: {
    version: string;
    name: string;
    description: string;
  };
}

@Injectable()
export class NpmPluginVersionService {
  /**
   * get npm versions results per package and structure it as plugin version DTO
   * @param npmVersions
   * @param pluginId
   * @returns
   */
  structurePluginVersion(
    npmVersions: NpmVersion,
    pluginId: string
  ): PluginVersion[] {
    const pluginVersions: PluginVersion[] = [];

    const now = new Date();
    for (const [key, value] of Object.entries(npmVersions)) {
      pluginVersions.push({
        createdAt: now,
        id: "",
        pluginId: pluginId,
        pluginIdVersion: `${pluginId}_${value.version}`,
        settings: "{}",
        updatedAt: now,
        version: value.version,
      });
    }

    return pluginVersions;
  }
  /**
   * generator to fetch npm data for each plugin
   * @param plugins
   * @return PluginVersion[]
   */
  async *getPluginVersion(
    plugins: Plugin[]
  ): AsyncGenerator<PluginVersion[], void> {
    try {
      const pluginLength = plugins.length;
      let index = 0;

      do {
        const pluginNpmName = plugins[index].npm;
        if (!pluginNpmName)
          throw `Plugin ${plugins[index].name} doesn't have npm name`;

        const npmResponse = await fetch(
          `https://registry.npmjs.org/${pluginNpmName}`
        );
        const pluginNpmData = await npmResponse.json();
        if (!pluginNpmData.versions)
          throw `Plugin ${plugins[index].name} doesn't have npm versions`;

        const pluginVersionArr = this.structurePluginVersion(
          pluginNpmData.versions,
          plugins[index].pluginId
        );

        ++index;

        yield pluginVersionArr;
      } while (pluginLength > index);
    } catch (error) {
      // TODO add error handling
    }
  }
  /**
   * main service function trigger generator in for await loop for each plugin
   * @param plugins
   * @returns
   */
  async updatePluginsVersion(plugins: Plugin[]): Promise<PluginVersion[]> {
    try {
      const pluginsVersions: PluginVersion[] = [];

      for await (const pluginVersionArr of this.getPluginVersion(plugins)) {
        pluginsVersions.push(...pluginVersionArr);
      }

      return pluginsVersions;
    } catch (error) {
      // TODO add error handling
    }
  }
}
