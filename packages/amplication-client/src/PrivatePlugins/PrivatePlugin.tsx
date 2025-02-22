import {
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  Toggle,
  UserAndTime,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import PrivatePluginVersionList from "../PrivatePluginVersion/PrivatePluginVersionList";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { DeletePrivatePlugin } from "./DeletePrivatePlugins";
import usePrivatePlugin from "./hooks/usePrivatePlugin";
import PrivatePluginEditCodeButton from "./PrivatePluginEditCodeButton";
import PrivatePluginForm from "./PrivatePluginForm";

const PrivatePlugin = () => {
  const match = useRouteMatch<{
    privatePluginId: string;
  }>("/:workspace/platform/:project/private-plugins/:privatePluginId");

  const { baseUrl } = useProjectBaseUrl();

  const { privatePluginId } = match?.params ?? {};
  const {
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
    currentUser,
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
  } = usePrivatePlugin();

  const onVersionChanged = useCallback(() => {
    refetch();
  }, [refetch]);

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
  }, [history, baseUrl]);

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

  const lockedByUser = data?.privatePlugin?.lockedByUser;

  const isLocked =
    Boolean(lockedByUser) && currentUser?.id !== lockedByUser?.id;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.privatePlugin?.displayName || "Loading..."}
          subTitle={data?.privatePlugin?.description}
        />
        <FlexItem.FlexEnd>
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            {data?.privatePlugin && (
              <>
                {isLocked && (
                  <UserAndTime
                    account={data?.privatePlugin?.lockedByUser?.account || {}}
                    time={data?.privatePlugin?.lockedAt}
                    label="Locked:"
                    valueColor={EnumTextColor.ThemeRed}
                  />
                )}
                <PrivatePluginEditCodeButton
                  privatePlugin={data.privatePlugin}
                />

                <Toggle
                  name={"enabled"}
                  onValueChange={onEnableChanged}
                  checked={
                    data?.privatePlugin?.enabled
                      ? data?.privatePlugin?.enabled
                      : false
                  }
                ></Toggle>
                <DeletePrivatePlugin
                  privatePlugin={data?.privatePlugin}
                  onDelete={handleDeletePrivatePlugin}
                />
              </>
            )}
          </FlexItem>
        </FlexItem.FlexEnd>
      </FlexItem>

      <HorizontalRule />
      {!loading && (
        <PrivatePluginForm
          disabled={isLocked}
          onSubmit={handleSubmit}
          defaultValues={data?.privatePlugin}
        />
      )}

      <PrivatePluginVersionList
        disabled={isLocked}
        privatePlugin={data?.privatePlugin}
        onVersionAdd={onVersionChanged}
      />

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default PrivatePlugin;
