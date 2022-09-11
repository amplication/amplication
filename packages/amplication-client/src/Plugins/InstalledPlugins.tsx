import { Snackbar } from "@amplication/design-system";
import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins, { Plugin } from "./hooks/usePlugins";
import * as models from "../models";
import PluginsCatalogItem from "./PluginsCatalogItem";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
// import DragPluginsCatalogItem from "./DragPluginCatalogItem";

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
    // onPluginDropped,
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

  const handleUninstall = useCallback(
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
    pluginInstallations?.PluginInstallations.length ? (
      <DndProvider backend={HTML5Backend}>
      {pluginInstallations?.PluginInstallations.map((installation) => (
        <PluginsCatalogItem
          key={installation.id}
          plugin={pluginCatalog[installation.pluginId]}
          pluginInstallation={installation}
          onInstall={handleInstall}
          onUninstall={handleUninstall}
          isDraggable
        />
      ))}
      <Snackbar
        open={Boolean(updateError || createError)}
        message={errorMessage}
      />
    </DndProvider>
    ) : (<div className="plugin-installation-wrapper">
      <SvgThemeImage css="plugin-installation-empty " image={EnumImages.PLuginInstallationEmpty} />
      <div className="plugin-installation-empty-text">There are no plugins to show</div>
    </div>)
    
  );
};

export default InstalledPlugins;
