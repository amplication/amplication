import { useQuery } from "@apollo/client";
import { keyBy } from "lodash";
import { useEffect, useState } from "react";
import * as models from "../../models";
import { LATEST_VERSION_TAG } from "../constant";
import { GET_PLUGIN_VERSIONS_CATALOG } from "../queries/pluginsQueries";

export type PluginVersion = {
  version: string;
  isLatest: boolean;
  settings: Record<string, unknown>;
  configurations: Record<string, unknown>;
  id: string;
  pluginId: string;
  enabled: boolean;
  deprecated: boolean;
};

export type Plugin = {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  repo: string;
  npm: string;
  icon: string;
  github: string;
  website: string;
  categories: string[];
  type: string;
  taggedVersions: { [tag: string]: string };
  versions: PluginVersion[];
  isPrivate?: boolean;
  color?: string;
};

const usePluginCatalog = (codeGenerator: models.EnumCodeGenerator) => {
  const [pluginCategories, setPluginCategories] = useState<{
    categories: string[];
    pluginCategoriesMap: { [key: string]: string[] };
  }>({ categories: [], pluginCategoriesMap: {} });

  const [pluginCatalog, setPluginCatalog] = useState<{
    [key: string]: Plugin;
  }>({});

  const {
    data: pluginsVersionData,
    loading: loadingPluginsVersionData,
    error: errorPluginsVersionData,
  } = useQuery<{
    plugins: Plugin[];
  }>(GET_PLUGIN_VERSIONS_CATALOG, {
    context: {
      clientName: "pluginApiHttpLink",
    },
    variables: {
      codeGeneratorName: codeGenerator,
      //@todo: handle deprecated versions in the settings page before adding this filter
      // where: {
      //   deprecated: {
      //     equals: null,
      //   },
      // },
    },
  });

  useEffect(() => {
    if (!pluginsVersionData || loadingPluginsVersionData) return;

    const categoriesMap = {};
    const pluginCategoriesHash = {};
    const pluginsWithLatestVersion = pluginsVersionData.plugins.map(
      (plugin) => {
        const categories = plugin.categories;
        categories.forEach((category) => {
          if (!Object.prototype.hasOwnProperty.call(categoriesMap, category))
            categoriesMap[category] = 1;

          return;
        });
        pluginCategoriesHash[plugin.pluginId] = categories;
        const latestVersion = plugin.versions.find(
          (pluginVersion) => pluginVersion.isLatest
        );
        if (latestVersion) {
          return {
            ...plugin,
            versions: [
              {
                ...latestVersion, //copy the setting from the latest version to the "latest" version
                id: `${latestVersion.id}-${LATEST_VERSION_TAG}`,
                version: LATEST_VERSION_TAG,
              },
              ...plugin.versions,
            ],
          };
        } else return plugin;
      }
    );

    setPluginCategories({
      categories: Object.keys(categoriesMap),
      pluginCategoriesMap: pluginCategoriesHash,
    });

    const sortedPlugins = keyBy(
      pluginsWithLatestVersion,
      (plugin) => plugin.pluginId
    );

    setPluginCatalog(sortedPlugins);
  }, [pluginsVersionData, loadingPluginsVersionData]);

  useEffect(() => {
    if (!errorPluginsVersionData) return;

    setPluginCatalog({});
  }, [errorPluginsVersionData]);

  return {
    pluginCategories,
    pluginCatalog,
  };
};

export default usePluginCatalog;
