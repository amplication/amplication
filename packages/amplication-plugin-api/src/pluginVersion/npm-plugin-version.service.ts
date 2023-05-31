import { Inject, Injectable } from "@nestjs/common";
import { Plugin, PluginVersion } from "../../prisma/generated-prisma-client";
import fetch from "node-fetch";
import type { AbbreviatedManifest } from "pacote";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

interface NpmVersion {
  [versionNumber: string]: AbbreviatedManifest;
}

@Injectable()
export class NpmPluginVersionService {
  constructor(@Inject(AmplicationLogger) readonly logger: AmplicationLogger) {}
  /**
   * get npm versions results per package and structure it as plugin version DTO
   * @param npmVersions
   * @param pluginId
   * @returns
   */
  structurePluginVersion(
    npmVersions: NpmVersion,
    pluginId: string
  ): (PluginVersion & { tarballUrl: string })[] {
    const pluginVersions: (PluginVersion & { tarballUrl: string })[] = [];

    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(npmVersions)) {
      pluginVersions.push({
        createdAt: now,
        deprecated: value.deprecated?.toString() || null,
        id: "",
        pluginId: pluginId,
        pluginIdVersion: `${pluginId}_${value.version}`,
        settings: "{}",
        configurations: "{}",
        updatedAt: now,
        version: value.version,
        tarballUrl: value.dist.tarball,
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
  ): AsyncGenerator<(PluginVersion & { tarballUrl: string })[], void> {
    try {
      const pluginLength = plugins?.length || 0;
      let index = 0;

      do {
        const pluginNpmName = plugins[index].npm;
        if (!pluginNpmName)
          throw `Plugin ${plugins[index].name} doesn't have npm name`;

        let npmError;
        const npmResponse = await fetch(
          `https://registry.npmjs.org/${pluginNpmName}`
        ).catch((error) => {
          error = npmError;
        });

        if (npmError || (npmResponse && !npmResponse?.ok)) {
          this.logger.error(
            npmError.message || "Response from npm was not successful",
            npmError,
            {
              npmResponse,
            }
          );
          ++index;
          yield null;
          continue;
        }

        const pluginNpmData = npmResponse && (await npmResponse.json());
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
      this.logger.error(error.message, error);
    }
  }
  /**
   * main service function trigger generator in for await loop for each plugin
   * @param plugins
   * @returns
   */
  async updatePluginsVersion(
    plugins: Plugin[]
  ): Promise<(PluginVersion & { tarballUrl: string })[]> {
    try {
      const pluginsVersions: (PluginVersion & { tarballUrl: string })[] = [];
      if (!plugins?.length) return pluginsVersions;

      for await (const pluginVersionArr of this.getPluginVersion(plugins)) {
        pluginVersionArr && pluginsVersions.push(...pluginVersionArr);
      }

      return pluginsVersions;
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
