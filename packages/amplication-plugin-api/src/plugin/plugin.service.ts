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

  /**
   * main service that trigger gitPluginService and return plugin list. It creates the plugins into DB
   * @returns Plugin[]
   */
  async githubCatalogPlugins(): Promise<Plugin[]> {
    try {
      const pluginsList = await this.gitPluginService.getPlugins();
      if (
        !pluginsList.length ||
        Object.prototype.toString.call(pluginsList) === "[object String]"
      ) {
        throw pluginsList;
      }

      const createdPlugins = await this.prisma.plugin.createMany({
        data: pluginsList.map((plugin) => ({
          description: plugin.description,
          github: plugin.github,
          icon: plugin.icon,
          name: plugin.name,
          npm: plugin.npm,
          website: plugin.website,
          pluginId: plugin.pluginId,
          createdAt: plugin.createdAt,
          updatedAt: plugin.updatedAt,
        })),
        skipDuplicates: true,
      });

      this.logger.debug("createdPlugins", createdPlugins);

      return pluginsList;
    } catch (error) {
      this.logger.error("githubCatalogPlugins", error);
      return error.message;
    }
  }
}
