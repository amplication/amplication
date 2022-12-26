import { Injectable } from "@nestjs/common";
import {
  Plugin,
  PluginVersion,
  Prisma,
} from "../../prisma/generated-prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import { PluginVersionServiceBase } from "./base/pluginVersion.service.base";
import { PluginService } from "../plugin/plugin.service";
import { NpmPluginVersionService } from "./npm-plugin-version.service";

@Injectable()
export class PluginVersionService extends PluginVersionServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private pluginService: PluginService,
    private npmPluginVersionService: NpmPluginVersionService
  ) {
    super(prisma);
  }
  async upsert<T extends Prisma.PluginVersionUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionUpsertArgs>
  ): Promise<PluginVersion> {
    return this.prisma.pluginVersion.upsert(args);
  }
  /**
   * get all saved plugin from DB
   * @returns Plugin[]
   */
  async getPlugins(): Promise<Plugin[]> {
    try {
      return await this.pluginService.findMany({});
    } catch (error) {}
  }
  /**
   * main service function.upsert all plugins versions into DB
   * @returns Plugin[]
   */
  async npmPluginsVersions() {
    try {
      const plugins = await this.getPlugins();
      if (!plugins || !plugins.length) throw "There are no plugins to get";

      const pluginsVersions =
        await this.npmPluginVersionService.updatePluginsVersion(plugins);
      if (!pluginsVersions.length) throw "Failed to fetch versions for plugin";

      const insertedPluginVersionArr: PluginVersion[] = [];
      for await (const versionData of pluginsVersions) {
        const {
          createdAt,
          pluginId,
          settings,
          updatedAt,
          version,
          pluginIdVersion,
        } = versionData;
        const upsertPluginVersion = await this.upsert({
          where: {
            pluginIdVersion,
          },
          update: {
            settings,
            updatedAt,
          },
          create: {
            pluginId,
            pluginIdVersion,
            settings,
            version,
            createdAt,
            updatedAt,
          },
        });

        insertedPluginVersionArr.push(upsertPluginVersion);
      }

      return insertedPluginVersionArr;
    } catch (error) {
      console.log(error);
    }
  }
}
