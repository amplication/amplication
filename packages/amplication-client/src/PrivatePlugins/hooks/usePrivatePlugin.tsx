import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_PRIVATE_PLUGIN,
  DELETE_PRIVATE_PLUGIN,
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

type TGetData = {
  privatePlugin: models.PrivatePlugin;
};

const DATE_CREATED_FIELD = "createdAt";

const usePrivatePlugin = (resourceId: string) => {
  const { addBlock } = useContext(AppContext);

  const [
    getPrivatePluginsInternal,
    {
      data: getPrivatePluginsData,
      loading: getPrivatePluginsLoading,
      error: getPrivatePluginsError,
    },
  ] = useLazyQuery<TGetPluginsData>(GET_PRIVATE_PLUGINS, {});

  const getPrivatePlugins = useCallback(
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

      onCompleted: (data) => {
        addBlock(data.deletePrivatePlugin.id);
      },
    });

  const [
    createPrivatePlugin,
    { error: createPrivatePluginError, loading: createPrivatePluginLoading },
  ] = useMutation(CREATE_PRIVATE_PLUGIN, {
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
    useMutation(UPDATE_PRIVATE_PLUGIN);

  return {
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
    getPrivatePlugins,
    getPrivatePluginsData,
    getPrivatePluginsLoading,
    getPrivatePluginsError,
    deletePrivatePlugin,
    deletePrivatePluginError,
  };
};

export default usePrivatePlugin;
