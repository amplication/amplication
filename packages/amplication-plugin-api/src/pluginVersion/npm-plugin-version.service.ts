import { Inject, Injectable } from "@nestjs/common";
import { Plugin, PluginVersion } from "../../prisma/generated-prisma-client";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Packument } from "pacote";
import { NpmService } from "../npm/npm.service";

@Injectable()
export class NpmPluginVersionService {
  constructor(
    @Inject(AmplicationLogger) readonly logger: AmplicationLogger,
    private readonly npmService: NpmService
  ) {}
  /**
   * get npm versions results per package and structure it as plugin version DTO
   * @param npmVersions
   * @param pluginId
   * @returns
   */
  structurePluginVersion(
    npmManifest: Packument,
    pluginId: string
  ): (PluginVersion & { tarballUrl: string })[] {
    const pluginVersions: (PluginVersion & { tarballUrl: string })[] = [];

    for (const [, value] of Object.entries(npmManifest.versions)) {
      pluginVersions.push({
        createdAt: new Date(npmManifest.time[value.version]),
        deprecated: value.deprecated?.toString() || null,
        id: "",
        pluginId: pluginId,
        pluginIdVersion: `${pluginId}_${value.version}`,
        settings: "{}",
        configurations: "{}",
        updatedAt: new Date(),
        version: value.version,
        tarballUrl: value.dist.tarball,
        isLatest: npmManifest["dist-tags"].latest === value.version,
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

        let npmPackument: Packument;
        try {
          npmPackument = await this.npmService.getPackagePackument(
            pluginNpmName
          );
        } catch (error) {
          this.logger.error(error.message, error, { pluginNpmName });
          ++index;
          yield null;
          continue;
        }

        const pluginVersionArr = this.structurePluginVersion(
          npmPackument,
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
