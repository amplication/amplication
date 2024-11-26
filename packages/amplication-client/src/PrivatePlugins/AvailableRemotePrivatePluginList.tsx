import {
  CircularProgress,
  CollapsibleListItem,
  ConfirmationDialog,
  EnumItemsAlign,
  FlexItem,
  Snackbar,
  Tooltip,
  VerticalNavigation,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import useAvailableCodeGenerators from "../Workspaces/hooks/useAvailableCodeGenerators";
import usePrivatePlugin from "./hooks/usePrivatePlugin";

const CLASS_NAME = "private-plugin-list";
const CONFIRM_BUTTON = { label: "Add" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  pluginRepositoryResource: models.Resource;
  onPrivatePluginAdd?: (privatePlugin: models.PrivatePlugin) => void;
};

export const AvailableRemotePrivatePluginList = React.memo(
  ({ pluginRepositoryResource, onPrivatePluginAdd }: Props) => {
    const { addEntity } = useAppContext();
    const [createPluginId, setCreatePluginId] = useState<string | null>(null);

    const {
      privatePlugins,
      privatePluginsByCodeGenerator,
      loadPrivatePlugins,
      loadPrivatePluginsError: error,
      getPluginRepositoryRemotePlugins,
      pluginRepositoryRemotePluginsLoading: remotePluginsLoading,
      pluginRepositoryRemotePluginsData: remotePluginsData,
      pluginRepositoryRemotePluginsError: remotePluginsError,
      pluginRepositoryRemotePluginsRefetch: remotePluginsRefetch,
      createPrivatePlugin,
      createPrivatePluginError: createError,
      createPrivatePluginLoading: createLoading,
    } = usePrivatePlugin(pluginRepositoryResource?.id);

    const { defaultCodeGenerator } = useAvailableCodeGenerators();

    const hasError =
      Boolean(error) || Boolean(remotePluginsError) || Boolean(createError);

    const errorMessage =
      formatError(error) ||
      formatError(remotePluginsError) ||
      formatError(createError);

    useEffect(() => {
      loadPrivatePlugins(undefined);
    }, [loadPrivatePlugins]);

    useEffect(() => {
      if (!pluginRepositoryResource) {
        return;
      }
      getPluginRepositoryRemotePlugins({
        variables: {
          where: {
            id: pluginRepositoryResource.id,
          },
        },
      });
    }, [getPluginRepositoryRemotePlugins, pluginRepositoryResource]);

    const availableRemotePlugin = useMemo(() => {
      if (!remotePluginsData?.pluginRepositoryRemotePlugins) {
        return [];
      }

      const privatePluginsIds = privatePlugins.reduce((acc, privatePlugin) => {
        acc[privatePlugin.pluginId] = true;
        return acc;
      }, {} as Record<string, boolean>);

      console.log({ privatePluginsIds });

      return remotePluginsData.pluginRepositoryRemotePlugins.content?.filter(
        (remotePlugin) => !privatePluginsIds[remotePlugin.name]
      );
    }, [privatePlugins, remotePluginsData?.pluginRepositoryRemotePlugins]);

    const handleCreatePlugin = useCallback((pluginId: string) => {
      setCreatePluginId(pluginId);
    }, []);

    const codeGenerator = useMemo(() => {
      //if privatePluginsByCodeGenerator has only one key, return it
      if (
        privatePluginsByCodeGenerator &&
        Object.keys(privatePluginsByCodeGenerator).length === 1
      ) {
        return Object.keys(privatePluginsByCodeGenerator)[0];
      }

      return defaultCodeGenerator;
    }, [defaultCodeGenerator, privatePluginsByCodeGenerator]);

    const handleSubmit = useCallback(
      (pluginId: string) => {
        createPrivatePlugin({
          variables: {
            data: {
              displayName: pluginId,
              pluginId: pluginId,
              enabled: true,
              codeGenerator: codeGenerator,
              resource: { connect: { id: pluginRepositoryResource.id } },
            },
          },
        })
          .then((result) => {
            setCreatePluginId(null);
            if (onPrivatePluginAdd) {
              onPrivatePluginAdd(result.data.createPrivatePlugin);
            }
            addEntity(result.data.createPrivatePlugin.id);
          })
          .catch(console.error);
      },
      [
        createPrivatePlugin,
        codeGenerator,
        pluginRepositoryResource?.id,
        onPrivatePluginAdd,
        addEntity,
      ]
    );

    if (!pluginRepositoryResource) {
      return null;
    }

    return (
      <>
        <ConfirmationDialog
          isOpen={createPluginId !== null}
          title={`Add plugin '${createPluginId}' ?`}
          confirmButton={CONFIRM_BUTTON}
          dismissButton={DISMISS_BUTTON}
          message={<div>Confirm to Register the plugin in this project </div>}
          onConfirm={() => {
            handleSubmit(createPluginId);
          }}
          onDismiss={() => {
            setCreatePluginId(null);
          }}
        />
        <div className={CLASS_NAME}>
          <CollapsibleListItem
            initiallyExpanded={false}
            icon={"git_branch"}
            expandable
            onExpand={remotePluginsRefetch}
            childItems={
              <>
                <VerticalNavigation>
                  {availableRemotePlugin &&
                    availableRemotePlugin.map((remotePlugin) => (
                      <CollapsibleListItem
                        onExpand={() => {
                          handleCreatePlugin(remotePlugin.name);
                        }}
                        key={remotePlugin.path}
                        icon={"plugin"}
                      >
                        <FlexItem
                          itemsAlign={EnumItemsAlign.Center}
                          singeChildWithEllipsis
                        >
                          {remotePlugin.name}
                        </FlexItem>
                      </CollapsibleListItem>
                    ))}
                </VerticalNavigation>
              </>
            }
          >
            <Tooltip title="These are the plugins available in the repository that have not been added to your project yet.">
              <span>
                Available Plugins ({availableRemotePlugin?.length || 0})
              </span>
            </Tooltip>
          </CollapsibleListItem>

          {remotePluginsLoading && <CircularProgress />}

          <Snackbar open={hasError} message={errorMessage} />
        </div>
      </>
    );
  }
);
