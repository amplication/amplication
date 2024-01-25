import { Inject, Injectable } from "@nestjs/common";
import { Plugin, PrismaPromise } from "../../prisma/generated-prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import { PluginServiceBase } from "./base/plugin.service.base";
import { GitPluginService } from "./github-plugin.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { PluginUpdateInput } from "./base/PluginUpdateInput";
import { CategoryUpdateInput } from "src/category/base/CategoryUpdateInput";
import { PluginCreateInput } from "./base/PluginCreateInput";
import { CategoryCreateInput } from "src/category/base/CategoryCreateInput";

interface PluginsDataObj {
  pluginsData: PluginCreateInput[];
  pluginUpdate: PrismaPromise<PluginUpdateInput>[];
  categories: {
    categoryMap: { [key: string]: number };
    data: CategoryCreateInput[];
    categoryUpdate: PrismaPromise<CategoryUpdateInput>[];
  };
}

const setPluginData = (plugin) => ({
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
  categories: plugin.categories,
  downloads: plugin.downloads,
});

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

      const pluginsAndCategories = pluginsList.reduce(
        (pluginsDataObj: PluginsDataObj, plugin: PluginCreateInput) => {
          const pluginData = setPluginData(plugin);

          pluginsDataObj.pluginsData.push(pluginData);
          const pluginUpdate = this.prisma.plugin.update({
            where: {
              pluginId: plugin.pluginId,
            },
            data: pluginData,
          });
          pluginsDataObj.pluginUpdate.push(pluginUpdate);

          (plugin.categories as []).forEach((category) => {
            if (pluginsDataObj.categories.categoryMap[category]) return;

            const categoryData: CategoryCreateInput = { name: category };
            pluginsDataObj.categories.categoryMap[category] = 1;
            pluginsDataObj.categories.data.push(categoryData);
            const categoryUpdate = this.prisma.category.update({
              where: {
                name: category,
              },
              data: categoryData,
            });
            pluginsDataObj.categories.categoryUpdate.push(categoryUpdate);
          });

          return pluginsDataObj;
        },
        {
          pluginsData: [],
          pluginUpdate: [],
          categories: {
            categoryMap: {},
            data: [],
            categoryUpdate: [],
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

      await this.prisma.$transaction(
        pluginsAndCategories.categories.categoryUpdate
      );

      this.logger.debug("createdCategories", createdCategories);

      return pluginsList;
    } catch (error) {
      this.logger.error("githubCatalogPlugins", error);
      return error.message;
    }
  }
}
