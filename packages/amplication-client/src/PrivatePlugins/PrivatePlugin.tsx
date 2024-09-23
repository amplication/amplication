import { useCallback, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import PrivatePluginForm from "./PrivatePluginForm";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { DeletePrivatePlugin } from "./DeletePrivatePlugins";
import {
  Snackbar,
  HorizontalRule,
  FlexItem,
  TabContentTitle,
  EnumFlexDirection,
  EnumContentAlign,
  Toggle,
  Panel,
  EnumPanelStyle,
  Text,
  EnumTextStyle,
  EnumTextColor,
} from "@amplication/ui/design-system";
import usePrivatePlugin from "./hooks/usePrivatePlugin";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type Props = {
  pluginRepositoryResourceId: string;
};

const PrivatePlugin = ({ pluginRepositoryResourceId }: Props) => {
  const match = useRouteMatch<{
    privatePluginId: string;
  }>("/:workspace/platform/:project/private-plugins/:privatePluginId");

  const { baseUrl } = useProjectBaseUrl();

  const { privatePluginId } = match?.params ?? {};
  const {
    currentWorkspace,
    currentProject,
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);
  const history = useHistory();

  const {
    getPrivatePlugin,
    getPrivatePluginLoading: loading,
    getPrivatePluginData: data,
    getPrivatePluginError: error,
    getPrivatePluginRefetch: refetch,
    updatePrivatePlugin,
    updatePrivatePluginError: updateError,
  } = usePrivatePlugin(pluginRepositoryResourceId);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;
    setResetPendingChangesIndicator(false);
    refetch();
  }, [refetch, resetPendingChangesIndicator, setResetPendingChangesIndicator]);

  const { trackEvent } = useTracking();

  const handleSubmit = useCallback(
    (data) => {
      const { pluginId, ...dataWithoutId } = data;

      updatePrivatePlugin({
        onCompleted: () => {
          addEntity(privatePluginId);
        },
        variables: {
          where: {
            id: privatePluginId,
          },
          data: dataWithoutId,
        },
      }).catch(console.error);
      trackEvent({
        eventName: AnalyticsEventNames.PrivatePluginUpdate,
        ...data,
      });
    },
    [updatePrivatePlugin, privatePluginId, trackEvent, addEntity]
  );

  const hasError = Boolean(error) || Boolean(updateError);

  const errorMessage = formatError(error) || formatError(updateError);

  const handleDeletePrivatePlugin = useCallback(() => {
    history.push(`${baseUrl}/private-plugins`);
  }, [history, currentWorkspace?.id, currentProject?.id]);

  useEffect(() => {
    getPrivatePlugin(privatePluginId);
  }, [getPrivatePlugin, privatePluginId]);

  const onEnableChanged = useCallback(
    (value: boolean) => {
      handleSubmit({
        enabled: value,
      });
    },
    [handleSubmit]
  );

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.privatePlugin?.displayName}
          subTitle={data?.privatePlugin?.description}
        />
        <FlexItem.FlexEnd
          direction={EnumFlexDirection.Row}
          alignSelf={EnumContentAlign.Start}
        >
          <Toggle
            name={"enabled"}
            onValueChange={onEnableChanged}
            checked={
              data?.privatePlugin?.enabled
                ? data?.privatePlugin?.enabled
                : false
            }
          ></Toggle>
          {data?.privatePlugin && (
            <DeletePrivatePlugin
              privatePlugin={data?.privatePlugin}
              onDelete={handleDeletePrivatePlugin}
            />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      <Panel panelStyle={EnumPanelStyle.Bordered}>
        <Text
          textStyle={EnumTextStyle.Description}
          textColor={EnumTextColor.ThemeOrange}
        >
          The plugin must be located in the connected git repository, in a
          folder named "plugins" and in a subfolder with the plugin ID.
        </Text>
        <br />
        <Text textStyle={EnumTextStyle.Description}>
          e.g. './plugins/private-aws-terraform/'
        </Text>
      </Panel>

      <HorizontalRule />
      {!loading && (
        <PrivatePluginForm
          onSubmit={handleSubmit}
          defaultValues={data?.privatePlugin}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default PrivatePlugin;
