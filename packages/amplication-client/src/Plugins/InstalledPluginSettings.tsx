import React, { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import usePlugins from "./hooks/usePlugins";
import { PluginLogo } from "./PluginLogo";
import "./InstalledPluginSettings.scss";
import { BackNavigation } from "../Components/BackNavigation";
import { AppContext } from "../context/appContext";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    plugin: string;
  }>;
};

const InstalledPluginSettings: React.FC<Props> = ({
  match,
  moduleClass,
}: Props) => {
  const { resource, plugin: pluginInstallationId } = match.params;
  const { currentProject, currentWorkspace } = useContext(AppContext);

  const {
    pluginInstallation,
    loadingPluginInstallation,
    pluginCatalog,
    // errorPluginInstallation,

    // updatePluginInstallation,
    // updateError,
  } = usePlugins(resource, pluginInstallationId);

  const plugin = useMemo(() => {
    return (
      pluginInstallation &&
      pluginCatalog[pluginInstallation?.PluginInstallation.pluginId]
    );
  }, [pluginInstallation, pluginCatalog]);

  return (
    <>
      <div className={`${moduleClass}__row`}>
        <BackNavigation
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/plugins/installed`}
          label="Back to Plugins"
        />
      </div>
      {loadingPluginInstallation || !plugin ? (
        <div>loading</div>
      ) : (
        <div className={moduleClass}>
          <div className={`${moduleClass}__row`}>
            <PluginLogo plugin={plugin} />
            <div className={`${moduleClass}__name`}>{plugin.name}</div>
          </div>
          <div className={`${moduleClass}__row `}>
            <span className={`${moduleClass}__description`}>
              {plugin.description}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default InstalledPluginSettings;
