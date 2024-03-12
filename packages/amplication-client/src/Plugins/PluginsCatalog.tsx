import { List, Snackbar, TabContentTitle } from "@amplication/ui/design-system";
import { useMutation, useQuery } from "@apollo/client";
import { keyBy } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { USER_ENTITY } from "../Entity/constants";
import { GET_ENTITIES } from "../Entity/EntityList";
import { TEntities } from "../Entity/NewEntity";
import * as models from "../models";
import useResource from "../Resource/hooks/useResource";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import { CREATE_DEFAULT_ENTITIES } from "../Workspaces/queries/entitiesQueries";
import usePlugins, { Plugin, PluginVersion } from "./hooks/usePlugins";
import PluginInstallConfirmationDialog from "./PluginInstallConfirmationDialog";
import PluginsCatalogItem from "./PluginsCatalogItem";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    category?: string;
  }>;
};

type TData = {
  entities: models.Entity[];
};

export type PluginInstallationData = {
  plugin: Plugin;
  pluginVersion: PluginVersion;
};
export const DIALOG_CLASS_NAME = "limitation-dialog";
export const REQUIRE_AUTH_ENTITY = "requireAuthenticationEntity";

const TITLE = "Plugins Catalog";
const SUB_TITLE =
  "Extend and customize your services by using plugins for various technologies and integrations.";

const PluginsCatalog: React.FC<Props> = ({ match }: Props) => {
  const { resource, category: encodedCategory } = match.params;
  const category = decodeURIComponent(encodedCategory);
  const [confirmInstall, setConfirmInstall] = useState<boolean>(false);
  const [isCreatePluginInstallation, setIsCreatePluginInstallation] =
    useState<boolean>(false);

  const [pluginInstallationData, setPluginInstallationData] =
    useState<PluginInstallationData>(null);

  const [pluginInstallationUpdateData, setPluginInstallationUpdateData] =
    useState<models.PluginInstallation>(null);

  const { resourceSettings } = useResource(resource);

  const { data: entities, refetch } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: resource,
    },
  });

  const {
    pluginInstallations,
    pluginCatalog,
    createPluginInstallation,
    createError,
    updatePluginInstallation,
    updateError,
    // onPluginDropped,
  } = usePlugins(resource);

  const filteredCatalog = useMemo(() => {
    if (category === "undefined") return Object.values(pluginCatalog);

    return Object.values(pluginCatalog).reduce(
      (pluginsCatalogArr: Plugin[], plugin: Plugin) => {
        if (!plugin.categories.includes(category)) return pluginsCatalogArr;

        pluginsCatalogArr.push(plugin);
        return pluginsCatalogArr;
      },
      []
    );
  }, [category, pluginCatalog]);

  const { addEntity } = useContext(AppContext);

  const userEntity = useMemo(() => {
    const authEntity = resourceSettings?.serviceSettings?.authEntityName;
    if (!authEntity) {
      return entities?.entities?.find(
        (entity) => entity.name.toLowerCase() === USER_ENTITY.toLowerCase()
      );
    } else return authEntity;
  }, [entities?.entities, resourceSettings?.serviceSettings]);

  const handleInstall = useCallback(
    (plugin: Plugin, pluginVersion: PluginVersion) => {
      const { name, pluginId, npm } = plugin;
      const { version, settings, configurations } = pluginVersion;
      const requireAuthenticationEntity = configurations
        ? configurations[REQUIRE_AUTH_ENTITY]
        : null;

      if (requireAuthenticationEntity === "true" && !userEntity) {
        setIsCreatePluginInstallation(true);
        setPluginInstallationData({
          plugin,
          pluginVersion,
        });

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
    [
      createPluginInstallation,
      setConfirmInstall,
      resource,
      userEntity,
      pluginInstallationData,
      setPluginInstallationData,
    ]
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
        setIsCreatePluginInstallation(false);
        setPluginInstallationUpdateData(pluginInstallation);

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
    [updatePluginInstallation, userEntity]
  );

  const installedPlugins = useMemo(() => {
    if (!pluginInstallations) return {};

    return keyBy(pluginInstallations, (plugin) => plugin && plugin.pluginId);
  }, [pluginInstallations]);

  const errorMessage = formatError(createError) || formatError(updateError);

  const [createDefaultEntities] = useMutation<TEntities>(
    CREATE_DEFAULT_ENTITIES,
    {
      onCompleted: (data) => {
        if (!data) return;
        const userEntity = data.createDefaultEntities.find(
          (x) => x.name.toLowerCase() === USER_ENTITY.toLowerCase()
        );
        addEntity(userEntity.id);
        refetch();
        setConfirmInstall(false);

        if (isCreatePluginInstallation) {
          const { plugin, pluginVersion } = pluginInstallationData;
          createPluginInstallation({
            variables: {
              data: {
                displayName: plugin.name,
                pluginId: plugin.pluginId,
                enabled: true,
                npm: plugin.npm,
                version: pluginVersion.version,
                settings: pluginVersion.settings,
                configurations: pluginVersion.configurations,
                resource: { connect: { id: resource } },
              },
            },
          }).catch(console.error);
        } else {
          const { enabled, version, settings, configurations, id } =
            pluginInstallationUpdateData;
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
        }
      },
    }
  );

  const handleCreateDefaultEntitiesConfirmation = useCallback(() => {
    createDefaultEntities({
      variables: {
        data: {
          resourceId: resource,
        },
      },
    }).catch(console.error);
  }, [
    createDefaultEntities,
    resource,
    pluginInstallationData,
    setPluginInstallationData,
  ]);

  return (
    <div>
      <PluginInstallConfirmationDialog
        confirmInstall={confirmInstall}
        handleDismissInstall={handleDismissInstall}
        handleCreateDefaultEntitiesConfirmation={
          handleCreateDefaultEntitiesConfirmation
        }
      ></PluginInstallConfirmationDialog>
      <TabContentTitle title={TITLE} subTitle={SUB_TITLE} />
      <List>
        {filteredCatalog.map((plugin) => (
          <PluginsCatalogItem
            key={plugin.pluginId}
            plugin={plugin}
            pluginInstallation={installedPlugins[plugin.pluginId]}
            onInstall={handleInstall}
            onEnableStateChange={onEnableStateChange}
          />
        ))}
      </List>
      <Snackbar
        open={Boolean(updateError || createError)}
        message={errorMessage}
      />{" "}
    </div>
  );
};

export default PluginsCatalog;
