import { Inject, Injectable } from "@nestjs/common";
import { Plugin, PrismaPromise } from "../../prisma/generated-prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import { PluginServiceBase } from "./base/plugin.service.base";
import { GitPluginService } from "./github-plugin.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { PluginUpdateInput } from "./base/PluginUpdateInput";
import { PluginCreateInput } from "./base/PluginCreateInput";
import { CategoryCreateInput } from "src/category/base/CategoryCreateInput";

interface PluginsDataObj {
  pluginsData: PluginCreateInput[];
  pluginUpdate: PrismaPromise<PluginUpdateInput>[];
  categories: {
    categoryMap: { [key: string]: number };
    data: CategoryCreateInput[];
  };
}

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
   * main service that trigger gitPluginService and return plugin list. It creates the plugins and categories into DB
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

      const pluginsAndCategories: PluginsDataObj = pluginsList.reduce(
        (pluginsDataObj: PluginsDataObj, plugin: Plugin) => {
          pluginsDataObj.pluginsData.push(plugin);

          const pluginUpdate = this.prisma.plugin.update({
            where: {
              pluginId: plugin.pluginId,
            },
            data: plugin,
          });
          pluginsDataObj.pluginUpdate.push(pluginUpdate);

          (plugin.categories as []).forEach((category) => {
            if (pluginsDataObj.categories.categoryMap[category]) return;

            const categoryData: CategoryCreateInput = { name: category };
            pluginsDataObj.categories.categoryMap[category] = 1;
            pluginsDataObj.categories.data.push(categoryData);
          });

          return pluginsDataObj;
        },
        {
          pluginsData: [],
          pluginUpdate: [],
          categories: {
            categoryMap: {},
            data: [],
          },
        }
      );

      const createdPlugins = await this.prisma.plugin.createMany({
        data: pluginsAndCategories.pluginsData,
        skipDuplicates: true,
      });

      await this.prisma.$transaction(pluginsAndCategories.pluginUpdate);

      this.logger.debug("createdPlugins", createdPlugins);

      const createdCategories = await this.prisma.category.createMany({
        data: pluginsAndCategories.categories.data,
        skipDuplicates: true,
      });

      this.logger.debug("createdCategories", createdCategories);

      return pluginsList;
    } catch (error) {
      this.logger.error("githubCatalogPlugins", error);
      return error.message;
    }
  }
}
