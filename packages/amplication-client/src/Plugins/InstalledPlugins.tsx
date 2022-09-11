import { Snackbar } from "@amplication/design-system";
import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins, { Plugin } from "./hooks/usePlugins";
import PluginsCatalogItem from "./PluginsCatalogItem";
import * as models from "../models";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const InstalledPlugins: React.FC<Props> = ({ match }: Props) => {
  const { resource } = match.params;

  const {
    pluginInstallations,
    // loadingPluginInstallations: loading,
    // errorPluginInstallations: error,
    pluginCatalog,
    createPluginInstallation,
    createError,
    updatePluginInstallation,
    updateError,
  } = usePlugins(resource);

  const handleInstall = useCallback(
    (plugin: Plugin) => {
      const { name, id } = plugin;

      createPluginInstallation({
        variables: {
          data: {
            displayName: name,
            pluginId: id,
            enabled: true,
            resource: { connect: { id: resource } },
          },
        },
      }).catch(console.error);
    },
    [createPluginInstallation, resource]
  );

  const onEnableStateChange = useCallback(
    (pluginInstallation: models.PluginInstallation) => {
      const { enabled, id } = pluginInstallation;

      updatePluginInstallation({
        variables: {
          data: {
            enabled: !enabled,
          },
          where: {
            id: id,
          },
        },
      }).catch(console.error);
    },
    [updatePluginInstallation]
  );

  const errorMessage = formatError(createError) || formatError(updateError);

  return (
    <div>
      {pluginInstallations?.PluginInstallations.map((installation) => (
        <PluginsCatalogItem
          key={installation.id}
          plugin={pluginCatalog[installation.pluginId]}
          pluginInstallation={installation}
          onInstall={handleInstall}
          onEnableStateChange={onEnableStateChange}
        />
      ))}
      <Snackbar
        open={Boolean(updateError || createError)}
        message={errorMessage}
      />
    </div>
  );
};

export default InstalledPlugins;
