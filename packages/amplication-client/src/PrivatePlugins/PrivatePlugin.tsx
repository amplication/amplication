import { useCallback, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import PrivatePluginForm from "./PrivatePluginForm";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { DeletePrivatePlugin } from "./DeletePrivatePlugins";
import { Snackbar, HorizontalRule } from "@amplication/ui/design-system";
import "./PrivatePlugin.scss";
import usePrivatePlugin from "./hooks/usePrivatePlugin";

const CLASS_NAME = "private-plugin";

const PrivatePlugin = () => {
  const match = useRouteMatch<{
    resource: string;
    privatePluginId: string;
  }>("/:workspace/:project/:resource/private-plugins/:privatePluginId");

  const { privatePluginId, resource } = match?.params ?? {};
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
  } = usePrivatePlugin(resource);

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
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resource}/private-plugins`
    );
  }, [history, currentWorkspace?.id, currentProject?.id, resource]);

  useEffect(() => {
    getPrivatePlugin(privatePluginId);
  }, [getPrivatePlugin, privatePluginId]);

  return (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Private Plugin Settings</h3>
        {data?.privatePlugin && (
          <DeletePrivatePlugin
            privatePlugin={data?.privatePlugin}
            onDelete={handleDeletePrivatePlugin}
          />
        )}
      </div>

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
