import { QueryOptions, useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_PLUGIN_INSTALLATION,
  GET_PLUGIN_INSTALLATION,
  GET_PLUGIN_INSTALLATIONS,
  GET_PLUGIN_ORDER,
  UPDATE_PLUGIN_INSTALLATION,
  UPDATE_PLUGIN_ORDER,
} from "../queries/pluginsQueries";
import usePluginCatalog, { Plugin, PluginVersion } from "./usePluginCatalog";
import usePrivatePlugin from "../../PrivatePlugins/hooks/usePrivatePlugin";
import { LATEST_VERSION_TAG } from "../constant";
import { compareBuild, valid } from "semver";

export interface SortedPluginInstallation extends models.PluginInstallation {
  categories?: string[];
}

export type OnPluginDropped = (
  dragItem: models.PluginInstallation,
  hoverItem: models.PluginInstallation
) => void;

const PRIVATE_PLUGIN_VERSION_DEFAULT_VALUES: PluginVersion = {
  version: LATEST_VERSION_TAG,
  isLatest: true,
  settings: {},
  configurations: {},
  id: "",
  pluginId: "",
  enabled: true,
  deprecated: false,
};

const PRIVATE_PLUGIN_DEFAULT_VALUES: Plugin = {
  id: "",
  pluginId: "",
  name: "",
  description: "",
  repo: "",
  npm: "",
  icon: "",
  github: "",
  website: "",
  categories: [],
  type: "",
  taggedVersions: {},
  versions: [],
};

const setPluginOrderMap = (pluginOrder: models.PluginOrderItem[]) => {
  return pluginOrder.reduce(
    (
      pluginOrderObj: { [key: string]: number },
      plugin: models.PluginOrderItem
    ) => {
      pluginOrderObj[plugin.pluginId] = plugin.order;

      return pluginOrderObj;
    },
    {}
  );
};

const usePlugins = (
  resourceId: string,
  pluginInstallationId?: string,
  codeGenerator?: models.EnumCodeGenerator
) => {
  const { pluginCatalog, pluginCategories } = usePluginCatalog(
    codeGenerator || models.EnumCodeGenerator.NodeJs
  );

  const {
    getAvailablePrivatePluginsForResource: loadPrivatePluginsCatalog,
    getAvailablePrivatePluginsForResourceData,
  } = usePrivatePlugin(resourceId);

  const [privatePluginCatalog, setPrivatePluginCatalog] = useState<{
    [key: string]: Plugin;
  }>({});

  const [pluginOrderObj, setPluginOrderObj] = useState<{
    [key: string]: number;
  }>();

  useEffect(() => {
    if (!getAvailablePrivatePluginsForResourceData) return;

    const privatePluginCatalogObj =
      getAvailablePrivatePluginsForResourceData.availablePrivatePluginsForResource?.reduce(
        (
          privatePluginCatalogObj: { [key: string]: Plugin },
          privatePlugin: models.PrivatePlugin
        ) => {
          privatePluginCatalogObj[privatePlugin.pluginId] = {
            ...PRIVATE_PLUGIN_DEFAULT_VALUES,
            id: privatePlugin.id,
            pluginId: privatePlugin.pluginId,
            name: privatePlugin.enabled
              ? privatePlugin.displayName
              : `${privatePlugin.displayName} (Disabled)`,
            description: privatePlugin.description,
            icon: privatePlugin.icon,
            color: privatePlugin.color,
            isPrivate: true,
            versions: [
              {
                //add the "latest" version
                ...PRIVATE_PLUGIN_VERSION_DEFAULT_VALUES,
                id: privatePlugin.id,
                pluginId: privatePlugin.pluginId,
              },
              ...privatePlugin.versions
                .sort((a, b) =>
                  !valid(b.version)
                    ? 1
                    : !valid(a.version)
                    ? -1
                    : compareBuild(b.version, a.version)
                )
                .map((version) => ({
                  ...PRIVATE_PLUGIN_VERSION_DEFAULT_VALUES,
                  ...version,
                  isLatest: false,
                })),
            ],
          };

          return privatePluginCatalogObj;
        },
        {}
      );

    setPrivatePluginCatalog(privatePluginCatalogObj);
  }, [getAvailablePrivatePluginsForResourceData]);

  const {
    addBlock,
    pendingChanges,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);

  const {
    data: pluginInstallations,
    loading: loadingPluginInstallations,
    refetch: refetchPluginInstallations,
    error: errorPluginInstallations,
  } = useQuery<{
    pluginInstallations: models.PluginInstallation[];
  }>(GET_PLUGIN_INSTALLATIONS, {
    variables: {
      resourceId: resourceId,
    },
    skip: !resourceId,
  });

  const {
    data: pluginInstallation,
    loading: loadingPluginInstallation,
    error: errorPluginInstallation,
  } = useQuery<{
    pluginInstallation: models.PluginInstallation;
  }>(GET_PLUGIN_INSTALLATION, {
    variables: {
      pluginId: pluginInstallationId,
    },
    skip: !pluginInstallationId,
  });

  const {
    data: pluginOrder,
    loading: loadingPluginOrder,
    refetch: refetchPluginOrder,
    error: pluginOrderError,
  } = useQuery<{ pluginOrder: models.PluginOrder }>(GET_PLUGIN_ORDER, {
    variables: {
      resourceId: resourceId,
    },
    skip: !resourceId,
  });

  const [createPluginInstallation, { error: createError }] = useMutation<{
    createPluginInstallation: models.PluginInstallation;
  }>(CREATE_PLUGIN_INSTALLATION, {
    onCompleted: (data) => {
      addBlock(data.createPluginInstallation.id);
    },
    refetchQueries: [
      {
        query: GET_PLUGIN_INSTALLATIONS,
        variables: {
          resourceId: resourceId,
        },
      },
      {
        query: GET_PLUGIN_ORDER,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  useEffect(() => {
    if (!pluginOrder || loadingPluginOrder) return;

    const setPluginOrder = setPluginOrderMap(pluginOrder?.pluginOrder.order);
    setPluginOrderObj(setPluginOrder);
  }, [pluginOrder, loadingPluginOrder]);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetchPluginInstallations();
    refetchPluginOrder();
  }, [
    pendingChanges,
    refetchPluginInstallations,
    refetchPluginOrder,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  ]);

  useEffect(() => {
    if (pluginOrderError) {
      setPluginOrderObj({});
    }
  }, [pluginOrderError]);

  const sortedPluginInstallation: SortedPluginInstallation[] = useMemo(() => {
    if (
      !pluginOrder ||
      !pluginInstallations ||
      !pluginCatalog ||
      loadingPluginInstallations
    )
      return undefined;

    const pluginOrderArr = [...(pluginOrder?.pluginOrder.order ?? [])];

    return pluginOrderArr.map((plugin: models.PluginOrderItem) => {
      const installedPlugin: models.PluginInstallation & {
        categories?: string[];
      } = pluginInstallations?.pluginInstallations.find(
        (installationPlugin: models.PluginInstallation) =>
          installationPlugin.pluginId === plugin.pluginId
      );
      if (!installedPlugin) return installedPlugin;

      installedPlugin.categories =
        pluginCategories.pluginCategoriesMap[installedPlugin.pluginId];

      return installedPlugin;
    }) as unknown as models.PluginInstallation[];
  }, [
    pluginOrder,
    pluginInstallations,
    pluginCatalog,
    loadingPluginInstallations,
    pluginCategories?.pluginCategoriesMap,
  ]);

  const [updatePluginOrder, { error: UpdatePluginOrderError }] = useMutation<{
    setPluginOrder: models.PluginOrder;
  }>(UPDATE_PLUGIN_ORDER, {
    onCompleted: (data) => {
      addBlock(data.setPluginOrder.id);
    },
    refetchQueries: [
      {
        query: GET_PLUGIN_ORDER,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  const [updatePluginInstallation, { error: updateError }] = useMutation<{
    updatePluginInstallation: models.PluginInstallation;
  }>(UPDATE_PLUGIN_INSTALLATION, {
    onCompleted: (data) => {
      addBlock(data.updatePluginInstallation.id);
    },
    refetchQueries: () => {
      const queries: QueryOptions[] = [
        {
          query: GET_PLUGIN_INSTALLATIONS,
          variables: {
            resourceId: resourceId,
          },
        },
        {
          query: GET_PLUGIN_ORDER,
          variables: {
            resourceId: resourceId,
          },
        },
      ];

      if (pluginInstallationId) {
        queries.push({
          query: GET_PLUGIN_INSTALLATION,
          variables: {
            pluginId: pluginInstallationId,
          },
        });
      }
      return queries;
    },
  });

  const onPluginDropped = useCallback(
    (
      dragPlugin: models.PluginInstallation,
      hoverPlugin: models.PluginInstallation
    ) => {
      console.log(dragPlugin, hoverPlugin);
    },
    []
  );

  return {
    loadPrivatePluginsCatalog,
    privatePluginCatalog,
    pluginInstallations: sortedPluginInstallation,
    loadingPluginInstallations,
    errorPluginInstallations,
    pluginInstallation,
    loadingPluginInstallation,
    errorPluginInstallation,
    updatePluginInstallation,
    updateError,
    createPluginInstallation,
    createError,
    categories: pluginCategories.categories,
    pluginCatalog,
    onPluginDropped,
    pluginOrderObj,
    updatePluginOrder,
    UpdatePluginOrderError,
  };
};

export default usePlugins;
