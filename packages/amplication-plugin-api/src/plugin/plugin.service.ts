import { Injectable } from "@nestjs/common";
import { Plugin } from "@amplication/prisma-clients/amplication-plugin-api";
import { PrismaService } from "../prisma/prisma.service";
import { PluginServiceBase } from "./base/plugin.service.base";
import { GitPluginService } from "./github-plugin.service";

@Injectable()
export class PluginService extends PluginServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private gitPluginService: GitPluginService
  ) {
    super(prisma);
  }

  async githubCatalogPlugins() {
    try {
      const pluginsList = await this.gitPluginService.getPlugins();
      if (
        !pluginsList.length ||
        Object.prototype.toString.call(pluginsList) === "[object String]"
      )
        throw pluginsList;

      const now = new Date();
      const insertedPluginArr: Plugin[] = [];
      for await (const plugin of pluginsList) {
        const { description, github, icon, name, npm, website, pluginId } =
          plugin;
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
            updatedAt: now,
            website,
          },
          create: {
            description,
            github,
            icon,
            name,
            npm,
            updatedAt: now,
            website,
            pluginId,
            createdAt: now,
          },
        });
        insertedPluginArr.push(upsertPlugin);
      }

      return insertedPluginArr;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
