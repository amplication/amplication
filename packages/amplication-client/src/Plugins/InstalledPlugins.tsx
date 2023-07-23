import { Snackbar } from "@amplication/ui/design-system";
import React, { useCallback, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins, { Plugin } from "./hooks/usePlugins";
import * as models from "../models";
import PluginsCatalogItem from "./PluginsCatalogItem";
import { EnumImages } from "../Components/SvgThemeImage";
import { EmptyState } from "../Components/EmptyState";
import { REQUIRE_AUTH_ENTITY } from "./PluginsCatalog";
import PluginInstallConfirmationDialog from "./PluginInstallConfirmationDialog";
import { useQuery } from "@apollo/client";
import { GET_ENTITIES } from "../Entity/EntityList";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import { USER_ENTITY } from "../Entity/constants";
// import DragPluginsCatalogItem from "./DragPluginCatalogItem";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

type TData = {
  entities: models.Entity[];
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
    pluginOrderObj,
    updatePluginOrder,
    UpdatePluginOrderError,
    // onPluginDropped,
  } = usePlugins(resource);

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
    const authEntity = resourceSettings.serviceSettings.authEntityName;

    if (!authEntity) {
      return entities?.entities?.find(
        (entity) => entity.name.toLowerCase() === USER_ENTITY.toLowerCase()
      );
    } else return authEntity;
  }, [entities]);

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

  const onOrderChange = useCallback(
    ({ id, order }: { id: string; order: number }) => {
      if (!pluginInstallations) return;

      if (order < 1 || order > pluginInstallations.length) return;

      updatePluginOrder({
        variables: {
          data: {
            order,
          },
          where: {
            id,
          },
        },
      }).catch(console.error);
    },
    [pluginInstallations, updatePluginOrder]
  );

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

  const handleDismissInstall = useCallback(() => {
    setConfirmInstall(false);
  }, [setConfirmInstall]);

  const errorMessage =
    formatError(createError) ||
    formatError(updateError) ||
    formatError(UpdatePluginOrderError);

  return pluginInstallations && pluginOrderObj ? (
    <div>
      <PluginInstallConfirmationDialog
        confirmInstall={confirmInstall}
        handleDismissInstall={handleDismissInstall}
      ></PluginInstallConfirmationDialog>
      <DndProvider backend={HTML5Backend}>
        {pluginInstallations.length &&
          pluginInstallations.map((installation) => (
            <PluginsCatalogItem
              key={installation.id}
              plugin={pluginCatalog[installation.pluginId]}
              pluginInstallation={installation as models.PluginInstallation}
              onOrderChange={onOrderChange}
              onInstall={handleInstall}
              onEnableStateChange={onEnableStateChange}
              order={pluginOrderObj[installation.pluginId]}
              isDraggable
            />
          ))}
        <Snackbar
          open={Boolean(updateError || createError)}
          message={errorMessage}
        />
      </DndProvider>
    </div>
  ) : (
    <EmptyState
      image={EnumImages.PluginInstallationEmpty}
      message="There are no plugins to show"
    />
  );
};

export default InstalledPlugins;
