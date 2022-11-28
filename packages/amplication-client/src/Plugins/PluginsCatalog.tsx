import { Snackbar } from "@amplication/design-system";
import { keyBy } from "lodash";
import React, { useCallback, useMemo } from "react";
import { match } from "react-router-dom";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins, { Plugin } from "./hooks/usePlugins";
import PluginsCatalogItem from "./PluginsCatalogItem";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PluginsCatalog: React.FC<Props> = ({ match }: Props) => {
  const { resource } = match.params;

  const {
    pluginInstallations,
    pluginCatalog,
    createPluginInstallation,
    createError,
    updatePluginInstallation,
    updateError,
    // onPluginDropped,
  } = usePlugins(resource);

  const handleInstall = useCallback(
    (plugin: Plugin) => {
      const { name, id, npm } = plugin;

      createPluginInstallation({
        variables: {
          data: {
            displayName: name,
            pluginId: id,
            enabled: true,
            npm,
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

  const installedPlugins = useMemo(() => {
    if (!pluginInstallations) return {};

    return keyBy(pluginInstallations, (plugin) => plugin && plugin.pluginId);
  }, [pluginInstallations]);

  const errorMessage = formatError(createError) || formatError(updateError);

  return (
    <div>
      {Object.entries(pluginCatalog).map(([pluginId, plugin]) => (
        <PluginsCatalogItem
          key={pluginId}
          plugin={plugin}
          pluginInstallation={installedPlugins[plugin.id]}
          onInstall={handleInstall}
          onEnableStateChange={onEnableStateChange}
        />
      ))}
      <Snackbar
        open={Boolean(updateError || createError)}
        message={errorMessage}
      />{" "}
    </div>
  );
};

export default PluginsCatalog;
