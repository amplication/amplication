import {
  Button,
  Dialog,
  EnumButtonStyle,
  Snackbar,
} from "@amplication/ui/design-system";
import { useQuery } from "@apollo/client";
import { keyBy } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { GET_ENTITIES } from "../Entity/EntityList";
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

type TData = {
  entities: models.Entity[];
};
export const DIALOG_CLASS_NAME = "limitation-dialog";
const USER_ENTITY_NAME = "user";
const REQUIRE_AUTH_ENTITY = "requireAuthenticationEntity";

const PluginsCatalog: React.FC<Props> = ({ match }: Props) => {
  const { resource } = match.params;
  const [confirmInstall, setConfirmInstall] = useState<boolean>(false);

  const { data: entities } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: resource,
    },
  });

  const userEntity = useMemo(() => {
    return entities.entities?.find(
      (entity) => entity.name.toLowerCase() === USER_ENTITY_NAME
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

      updatePluginInstallation({
        variables: {
          data: {
            enabled: !enabled,
            version,
            settings: settings,
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
      <Dialog
        title=""
        className={DIALOG_CLASS_NAME}
        isOpen={confirmInstall}
        onDismiss={handleDismissInstall}
      >
        <div className={`${DIALOG_CLASS_NAME}__message__keep_building`}>
          Plugin installation cannot proceed as an entity for authentication has
          not been defined. Please refer to our documentation on how to define
          an entity for authentication before attempting to install the
          authentication plugin
        </div>
        <Button
          className={`${DIALOG_CLASS_NAME}__upgrade_button`}
          buttonStyle={EnumButtonStyle.Primary}
          onClick={handleDismissInstall}
        >
          Dismiss
        </Button>
      </Dialog>
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
