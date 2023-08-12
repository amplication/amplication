import { Inject, Injectable } from "@nestjs/common";
import { Plugin } from "../../prisma/generated-prisma-client";
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
  async processCatalogPlugins(): Promise<Plugin[]> {
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
          taggedVersions: plugin.taggedVersions,
          pluginId: plugin.pluginId,
          createdAt: plugin.createdAt,
          updatedAt: plugin.updatedAt,
        })),
        skipDuplicates: true,
      });

      const updateMany = pluginsList.map((plugin) =>
        this.prisma.plugin.update({
          where: {
            pluginId: plugin.pluginId,
          },
          data: {
            createdAt: plugin.createdAt,
            updatedAt: plugin.updatedAt,
            description: plugin.description,
            github: plugin.github,
            taggedVersions: plugin.taggedVersions,
            icon: plugin.icon,
            name: plugin.name,
            npm: plugin.npm,
            website: plugin.website,
          },
        })
      );
      await this.prisma.$transaction(updateMany);

      this.logger.debug("createdPlugins", createdPlugins);

      return pluginsList;
    } catch (error) {
      this.logger.error("githubCatalogPlugins", error);
      return error.message;
    }
  }
}
