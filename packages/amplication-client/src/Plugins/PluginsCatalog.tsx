import { Snackbar } from "@amplication/ui/design-system";
import { useQuery } from "@apollo/client";
import { keyBy } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { GET_ENTITIES } from "../Entity/EntityList";
import * as models from "../models";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins, { Plugin, PluginVersion } from "./hooks/usePlugins";
import PluginInstallConfirmationDialog from "./PluginInstallConfirmationDialog";
import PluginsCatalogItem from "./PluginsCatalogItem";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

type TData = {
  entities: models.Entity[];
};
export const DIALOG_CLASS_NAME = "limitation-dialog";
export const REQUIRE_AUTH_ENTITY = "requireAuthenticationEntity";

const PluginsCatalog: React.FC<Props> = ({ match }: Props) => {
  const { resource } = match.params;
  const [confirmInstall, setConfirmInstall] = useState<boolean>(false);

  const { data: entities } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: resource,
    },
  });

  const { data: resourceSettings } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resource,
    },
  });

  const userEntity = useMemo(() => {
    return entities?.entities?.find(
      (entity) =>
        entity.name.toLowerCase() ===
        resourceSettings.serviceSettings.authEntityName?.toLowerCase()
    );
  }, [entities]);

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
      const { version, settings, configurations } = pluginVersion;
      const requireAuthenticationEntity = configurations
        ? configurations[REQUIRE_AUTH_ENTITY]
        : null;

      if (requireAuthenticationEntity === "true" && !userEntity) {
        setConfirmInstall(true);
        return;
      }

      createPluginInstallation({
        variables: {
          data: {
            displayName: name,
            pluginId,
            enabled: true,
            npm,
            version,
            settings: settings,
            configurations: configurations,
            resource: { connect: { id: resource } },
          },
        },
      }).catch(console.error);
    },
    [createPluginInstallation, setConfirmInstall, resource, userEntity]
  );

  const handleDismissInstall = useCallback(() => {
    setConfirmInstall(false);
  }, [setConfirmInstall]);

  const onEnableStateChange = useCallback(
    (pluginInstallation: models.PluginInstallation) => {
      const { enabled, version, settings, configurations, id } =
        pluginInstallation;

      const requireAuthenticationEntity = configurations
        ? configurations[REQUIRE_AUTH_ENTITY]
        : null;
      if (requireAuthenticationEntity === "true" && !userEntity && !enabled) {
        setConfirmInstall(true);
        return;
      }

      updatePluginInstallation({
        variables: {
          data: {
            enabled: !enabled,
            version,
            settings,
            configurations,
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
      <PluginInstallConfirmationDialog
        confirmInstall={confirmInstall}
        handleDismissInstall={handleDismissInstall}
      ></PluginInstallConfirmationDialog>
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
