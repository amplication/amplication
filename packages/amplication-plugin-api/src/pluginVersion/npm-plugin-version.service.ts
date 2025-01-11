import { Inject, Injectable } from "@nestjs/common";
import { Plugin, PluginVersion } from "../../prisma/generated-prisma-client";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Packument } from "pacote";
import { NpmService } from "../npm/npm.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NpmPluginVersionService {
  private readonly versionFilterRegex: RegExp;

  constructor(
    @Inject(AmplicationLogger) readonly logger: AmplicationLogger,
    private readonly npmService: NpmService,
    private readonly configService: ConfigService
  ) {
    // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    // i.e. 1.2.3
    const pluginStableVersionSemVerRegex =
      "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$";
    // i.e. 1.2.3-beta.4
    const pluginStableAndPrereleaseVersionSemVerRegex =
      "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$";

    const ignorePrereleaseVersions =
      this.configService.get<string>("IGNORE_PRERELEASE_PLUGIN_VERSIONS") ===
      "true";

    if (ignorePrereleaseVersions) {
      this.versionFilterRegex = new RegExp(pluginStableVersionSemVerRegex);
    } else {
      this.versionFilterRegex = new RegExp(
        pluginStableAndPrereleaseVersionSemVerRegex
      );
    }
  }

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

    for (const value of Object.values(npmManifest.versions)) {
      if (this.versionFilterRegex.test(value.version)) {
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
    }
    return pluginVersions;
  }

  /**
   * generator to fetch npm data for each plugin
   * @param plugins
   * @return PluginVersion[]
   */
  async *getPluginVersions(plugins: Plugin[]): AsyncGenerator<
    {
      pluginId: string;
      versions: (PluginVersion & { tarballUrl: string })[];
    },
    void
  > {
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

        yield {
          pluginId: plugins[index].pluginId,
          versions: pluginVersionArr,
        };

        ++index;
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
  async getAllPluginsVersions(plugins: Plugin[]): Promise<{
    [pluginId: string]: (PluginVersion & { tarballUrl: string })[];
  }> {
    try {
      const allVersionsByPlugin: {
        [pluginId: string]: (PluginVersion & { tarballUrl: string })[];
      } = {};

      if (!plugins?.length) return allVersionsByPlugin;

      for await (const pluginVersionResult of this.getPluginVersions(plugins)) {
        if (!pluginVersionResult) continue;

        this.logger.debug("pluginVersionResult", {
          pluginId: pluginVersionResult.pluginId,
          versions: pluginVersionResult.versions.map((v) => v.version),
        });

        allVersionsByPlugin[pluginVersionResult.pluginId] =
          pluginVersionResult.versions;
      }

      return allVersionsByPlugin;
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
