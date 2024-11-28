import {
  Button,
  CircularProgress,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  Panel,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useMemo } from "react";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { gitProviderIconMap } from "../Resource/git/git-provider-icon-map";
import { formatError } from "../util/error";
import { getGitRepositoryDetails } from "../util/git-repository-details";
import { pluralize } from "../util/pluralize";
import useAvailableCodeGenerators from "../Workspaces/hooks/useAvailableCodeGenerators";
import usePrivatePlugin from "./hooks/usePrivatePlugin";

const CLASS_NAME = "private-plugin-list";

type Props = {
  pluginRepositoryResource: models.Resource;
  onPrivatePluginAdd?: (privatePlugin: models.PrivatePlugin) => void;
  onDismiss: () => void;
};

export const AvailableRemotePrivatePluginList = React.memo(
  ({ pluginRepositoryResource, onPrivatePluginAdd, onDismiss }: Props) => {
    const { addEntity } = useAppContext();

    const gitRepositoryDetails = getGitRepositoryDetails({
      organization: pluginRepositoryResource.gitRepository?.gitOrganization,
      repositoryName: pluginRepositoryResource.gitRepository?.name,
      groupName: pluginRepositoryResource?.gitRepository?.groupName,
    });

    const gitProvider =
      pluginRepositoryResource.gitRepository?.gitOrganization.provider;

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

    const availableRemotePluginCount = availableRemotePlugin?.length || 0;

    return (
      <>
        <div className={CLASS_NAME}>
          <Panel panelStyle={EnumPanelStyle.Bordered}>
            <Text
              textStyle={EnumTextStyle.Description}
              textColor={EnumTextColor.White}
            >
              To add a plugin, it must be located in the connected git
              repository, in a folder named "plugins".
            </Text>
            <br />
            <Text textStyle={EnumTextStyle.Description}>
              e.g. '{gitRepositoryDetails.repositoryFullName}
              /plugins/private-aws-terraform/'
            </Text>
          </Panel>

          <FlexItem
            direction={EnumFlexDirection.Row}
            itemsAlign={EnumItemsAlign.Center}
            margin={EnumFlexItemMargin.Bottom}
            end={
              <Button
                buttonStyle={EnumButtonStyle.Outline}
                onClick={() => {
                  remotePluginsRefetch();
                }}
                disabled={remotePluginsLoading}
              >
                {remotePluginsLoading ? (
                  <>
                    <CircularProgress />
                  </>
                ) : (
                  <>
                    <Icon icon="refresh_cw" />
                  </>
                )}
              </Button>
            }
          >
            <Text textStyle={EnumTextStyle.Description}>
              {`${availableRemotePluginCount} available ${pluralize(
                availableRemotePluginCount,
                "plugin",
                "plugins"
              )}`}
            </Text>
          </FlexItem>

          <List>
            {availableRemotePluginCount === 0 && (
              <ListItem>
                <Text
                  textStyle={EnumTextStyle.Description}
                  textColor={EnumTextColor.ThemeOrange}
                >
                  No new plugins found in the repository.
                </Text>
              </ListItem>
            )}

            {availableRemotePlugin &&
              availableRemotePlugin.map((remotePlugin) => (
                <ListItem
                  onClick={() => {
                    handleSubmit(remotePlugin.name);
                  }}
                  key={remotePlugin.path}
                >
                  <FlexItem
                    itemsAlign={EnumItemsAlign.Center}
                    singeChildWithEllipsis
                  >
                    {remotePlugin.name}
                  </FlexItem>
                </ListItem>
              ))}
          </List>

          <FlexItem
            margin={EnumFlexItemMargin.Top}
            itemsAlign={EnumItemsAlign.Center}
            end={
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                onClick={() => {
                  onDismiss();
                }}
              >
                Close
              </Button>
            }
          >
            <a href={gitRepositoryDetails.repositoryUrl} target="github_repo">
              <Text textStyle={EnumTextStyle.Description}>
                <FlexItem
                  itemsAlign={EnumItemsAlign.Center}
                  gap={EnumGapSize.Small}
                >
                  <Icon icon={gitProviderIconMap[gitProvider]} />
                  Open git repository
                </FlexItem>
              </Text>
            </a>
          </FlexItem>
          <Snackbar open={hasError} message={errorMessage} />
        </div>
      </>
    );
  }
);
