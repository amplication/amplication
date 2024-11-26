import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_PRIVATE_PLUGIN,
  DELETE_PRIVATE_PLUGIN,
  GET_AVAILABLE_PRIVATE_PLUGINS_FOR_RESOURCE,
  GET_PLUGIN_REPOSITORY_REMOTE_PLUGINS,
  GET_PRIVATE_PLUGIN,
  GET_PRIVATE_PLUGINS,
  PRIVATE_PLUGINS_FIELDS_FRAGMENT,
  UPDATE_PRIVATE_PLUGIN,
} from "./privatePluginQueries";

type TFindData = {
  deletePrivatePlugin: models.PrivatePlugin;
};

type TGetPluginsData = {
  privatePlugins: models.PrivatePlugin[];
};

type TGetAvailablePrivatePluginsForResourceData = {
  availablePrivatePluginsForResource: models.PrivatePlugin[];
};

type TGetData = {
  privatePlugin: models.PrivatePlugin;
};

const DATE_CREATED_FIELD = "createdAt";
const NAME_FIELD = "displayName";

const usePrivatePlugin = (resourceId: string) => {
  const { addBlock } = useContext(AppContext);

  const [privatePluginsByCodeGenerator, setPrivatePluginsByCodeGenerator] =
    useState<Record<string, models.PrivatePlugin[]> | null>(null);

  const [privatePlugins, setPrivatePlugins] = useState<models.PrivatePlugin[]>(
    []
  );

  const [
    getAvailablePrivatePluginsForResourceInternal,
    {
      data: getAvailablePrivatePluginsForResourceData,
      loading: getAvailablePrivatePluginsForResourceLoading,
      error: getAvailablePrivatePluginsForResourceError,
    },
  ] = useLazyQuery<TGetAvailablePrivatePluginsForResourceData>(
    GET_AVAILABLE_PRIVATE_PLUGINS_FOR_RESOURCE,
    {
      fetchPolicy: "no-cache",
    }
  );

  const getAvailablePrivatePluginsForResource = useCallback(() => {
    getAvailablePrivatePluginsForResourceInternal({
      variables: {
        where: {
          resource: { id: resourceId },
        },
        orderBy: {
          [NAME_FIELD]: models.SortOrder.Asc,
        },
      },
    });
  }, [getAvailablePrivatePluginsForResourceInternal, resourceId]);

  const [
    getPrivatePluginsInternal,
    { loading: loadPrivatePluginsLoading, error: loadPrivatePluginsError },
  ] = useLazyQuery<TGetPluginsData>(GET_PRIVATE_PLUGINS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const pluginsByCodeGenerator = data.privatePlugins.reduce(
        (acc, plugin) => {
          const codeGenerator = plugin.codeGenerator;
          if (!acc[codeGenerator]) {
            acc[codeGenerator] = [];
          }
          acc[codeGenerator].push(plugin);
          return acc;
        },
        {} as Record<string, models.PrivatePlugin[]>
      );

      setPrivatePluginsByCodeGenerator(pluginsByCodeGenerator);
      setPrivatePlugins(data.privatePlugins);
    },
  });

  const loadPrivatePlugins = useCallback(
    (searchPhrase: string) => {
      getPrivatePluginsInternal({
        variables: {
          where: {
            resource: { id: resourceId },
            displayName:
              searchPhrase !== ""
                ? {
                    contains: searchPhrase,
                    mode: models.QueryMode.Insensitive,
                  }
                : undefined,
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        },
      });
    },
    [getPrivatePluginsInternal, resourceId]
  );

  const [deletePrivatePlugin, { error: deletePrivatePluginError }] =
    useMutation<TFindData>(DELETE_PRIVATE_PLUGIN, {
      update(cache, { data }) {
        if (!data) {
          return;
        }
        const deletedPrivatePluginId = data.deletePrivatePlugin.id;
        cache.modify({
          fields: {
            privatePlugins(existingPrivatePluginRefs, { readField }) {
              return existingPrivatePluginRefs.filter(
                (privatePluginRef: Reference) =>
                  deletedPrivatePluginId !== readField("id", privatePluginRef)
              );
            },
          },
        });
      },
      refetchQueries: [GET_PRIVATE_PLUGINS],
      onCompleted: (data) => {
        addBlock(data.deletePrivatePlugin.id);
      },
    });

  const [
    createPrivatePlugin,
    { error: createPrivatePluginError, loading: createPrivatePluginLoading },
  ] = useMutation(CREATE_PRIVATE_PLUGIN, {
    refetchQueries: [GET_PRIVATE_PLUGINS],
    update(cache, { data }) {
      if (!data) {
        return;
      }

      const newPrivatePlugin = data.createPrivatePlugin;

      cache.modify({
        fields: {
          privatePlugins(existingPrivatePluginRefs = [], { readField }) {
            const newPrivatePluginRef = cache.writeFragment({
              data: newPrivatePlugin,
              fragment: PRIVATE_PLUGINS_FIELDS_FRAGMENT,
            });

            if (
              existingPrivatePluginRefs.some(
                (privatePluginRef: Reference) =>
                  readField("id", privatePluginRef) === newPrivatePlugin.id
              )
            ) {
              return existingPrivatePluginRefs;
            }

            return [...existingPrivatePluginRefs, newPrivatePluginRef];
          },
        },
      });
    },
  });

  const [
    getPrivatePluginInternal,
    {
      data: getPrivatePluginData,
      error: getPrivatePluginError,
      loading: getPrivatePluginLoading,
      refetch: getPrivatePluginRefetch,
    },
  ] = useLazyQuery<TGetData>(GET_PRIVATE_PLUGIN);

  const getPrivatePlugin = useCallback(
    (privatePluginId: string) => {
      getPrivatePluginInternal({
        variables: {
          privatePluginId,
        },
      });
    },
    [getPrivatePluginInternal]
  );

  const [updatePrivatePlugin, { error: updatePrivatePluginError }] =
    useMutation(UPDATE_PRIVATE_PLUGIN, {
      refetchQueries: [GET_PRIVATE_PLUGINS],
    });

  const [
    getPluginRepositoryRemotePlugins,
    {
      data: pluginRepositoryRemotePluginsData,
      loading: pluginRepositoryRemotePluginsLoading,
      error: pluginRepositoryRemotePluginsError,
      refetch: pluginRepositoryRemotePluginsRefetch,
    },
  ] = useLazyQuery<{
    pluginRepositoryRemotePlugins: models.GitFolderContent;
  }>(GET_PLUGIN_REPOSITORY_REMOTE_PLUGINS);

  return {
    getAvailablePrivatePluginsForResource,
    getAvailablePrivatePluginsForResourceData,
    getAvailablePrivatePluginsForResourceLoading,
    getAvailablePrivatePluginsForResourceError,
    updatePrivatePlugin,
    updatePrivatePluginError,
    getPrivatePlugin,
    getPrivatePluginData,
    getPrivatePluginError,
    getPrivatePluginLoading,
    getPrivatePluginRefetch,
    createPrivatePlugin,
    createPrivatePluginError,
    createPrivatePluginLoading,
    loadPrivatePlugins,
    privatePluginsByCodeGenerator,
    privatePlugins,
    loadPrivatePluginsLoading,
    loadPrivatePluginsError,
    deletePrivatePlugin,
    deletePrivatePluginError,
    getPluginRepositoryRemotePlugins,
    pluginRepositoryRemotePluginsData,
    pluginRepositoryRemotePluginsLoading,
    pluginRepositoryRemotePluginsError,
    pluginRepositoryRemotePluginsRefetch,
  };
};

export default usePrivatePlugin;
