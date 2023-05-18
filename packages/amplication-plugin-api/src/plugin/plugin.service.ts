import { Inject, Injectable } from "@nestjs/common";
import { Plugin, Prisma } from "../../prisma/generated-prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import { PluginServiceBase } from "./base/plugin.service.base";
import { GitPluginService } from "./github-plugin.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class PluginService extends PluginServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private gitPluginService: GitPluginService,
    @Inject(AmplicationLogger) readonly logger: AmplicationLogger
  ) {
    super(prisma);
  }

  async upsert<T extends Prisma.PluginUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginUpsertArgs>
  ): Promise<Plugin> {
    return this.prisma.plugin.upsert(args);
  }

  /**
   * main service that trigger gitPluginService and return plugin list. It upsert the plugins to DB
   * @returns Plugin[]
   */
  async githubCatalogPlugins(): Promise<Plugin[]> {
    try {
      const pluginsList = await this.gitPluginService.getPlugins();
      if (
        !pluginsList.length ||
        Object.prototype.toString.call(pluginsList) === "[object String]"
      )
        throw pluginsList;

      const insertedPluginArr: Plugin[] = [];
      for await (const plugin of pluginsList) {
        const {
          description,
          github,
          icon,
          name,
          npm,
          website,
          pluginId,
          updatedAt,
          createdAt,
        } = plugin;
        const upsertPlugin = await this.upsert({
          where: {
            pluginId,
          },
          update: {
            description,
            github,
            icon,
            name,
            npm,
            updatedAt,
            website,
          },
          create: {
            description,
            github,
            icon,
            name,
            npm,
            updatedAt,
            website,
            pluginId,
            createdAt,
          },
        });
        insertedPluginArr.push(upsertPlugin);
      }

      return insertedPluginArr;
    } catch (error) {
      this.logger.error("githubCatalogPlugins", error);
      return error.message;
    }
  }
}
