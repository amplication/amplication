import { Snackbar } from "@amplication/ui/design-system";
import { keyBy } from "lodash";
import React, { useCallback, useMemo } from "react";
import { match } from "react-router-dom";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins, { Plugin, PluginVersion } from "./hooks/usePlugins";
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
    (plugin: Plugin, pluginVersion: PluginVersion) => {
      const { name, pluginId, npm } = plugin;
      const { version, settings } = pluginVersion;

      createPluginInstallation({
        variables: {
          data: {
            displayName: name,
            pluginId,
            enabled: true,
            npm,
            version,
            settings: JSON.parse(settings),
            resource: { connect: { id: resource } },
          },
        },
      }).catch(console.error);
    },
    [createPluginInstallation, resource]
  );

  const onEnableStateChange = useCallback(
    (pluginInstallation: models.PluginInstallation) => {
      const { enabled, version, settings, id } = pluginInstallation;

      updatePluginInstallation({
        variables: {
          data: {
            enabled: !enabled,
            version,
            settings,
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
          pluginInstallation={installedPlugins[plugin.pluginId]}
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
