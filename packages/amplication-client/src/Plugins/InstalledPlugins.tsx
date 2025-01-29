import {
  Button,
  EnumButtonStyle,
  List,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, match } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import usePlugins from "./hooks/usePlugins";
import { Plugin } from "./hooks/usePluginCatalog";
import * as models from "../models";
import PluginsCatalogItem from "./PluginsCatalogItem";
import { EnumImages } from "../Components/SvgThemeImage";
import { EmptyState } from "../Components/EmptyState";
import { REQUIRE_AUTH_ENTITY } from "./PluginsCatalog";
import PluginInstallConfirmationDialog from "./PluginInstallConfirmationDialog";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ENTITIES } from "../Entity/EntityList";
import { USER_ENTITY } from "../Entity/constants";
import { TEntities } from "../Entity/NewEntity";
import { CREATE_DEFAULT_ENTITIES } from "../Workspaces/queries/entitiesQueries";
import { AppContext, useAppContext } from "../context/appContext";
import useResource from "../Resource/hooks/useResource";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import { FIND_MODULES } from "../Modules/queries/modulesQueries";
// import DragPluginsCatalogItem from "./DragPluginCatalogItem";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

type TData = {
  entities: models.Entity[];
};

const TITLE = "Installed Plugins";
const SUB_TITLE = "Manage the plugins installed in your resource";

const InstalledPlugins: React.FC<Props> = ({ match }: Props) => {
  const { resource } = match.params;

  const { currentResource } = useAppContext();

  const { baseUrl } = useResourceBaseUrl();

  const { stigg } = useStiggContext();

  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });

  const {
    pluginInstallations,
    pluginCatalog,
    createPluginInstallation,
    createError,
    updatePluginInstallation,
    updateError,
    pluginOrderObj,
    updatePluginOrder,
    UpdatePluginOrderError,
    privatePluginCatalog,
    loadPrivatePluginsCatalog,
  } = usePlugins(resource, null, currentResource?.codeGenerator);

  useEffect(() => {
    if (canUsePrivatePlugins) {
      loadPrivatePluginsCatalog();
    }
  }, [canUsePrivatePlugins, loadPrivatePluginsCatalog]);

  const [confirmInstall, setConfirmInstall] = useState<boolean>(false);
  const [isCreatePluginInstallation, setIsCreatePluginInstallation] =
    useState<boolean>(false);

  const { serviceSettings } = useResource(resource);

  const [pluginInstallationData, setPluginInstallationData] =
    useState<Plugin>(null);

  const [pluginInstallationUpdateData, setPluginInstallationUpdateData] =
    useState<models.PluginInstallation>(null);

  const { addEntity } = useContext(AppContext);

  const { data: entities, refetch } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: resource,
    },
  });

  const userEntity = useMemo(() => {
    const authEntity = serviceSettings?.serviceSettings?.authEntityName;

    if (!authEntity) {
      return entities?.entities?.find(
        (entity) => entity.name.toLowerCase() === USER_ENTITY.toLowerCase()
      );
    } else return authEntity;
  }, [entities?.entities, serviceSettings?.serviceSettings?.authEntityName]);

  const handleInstall = useCallback(
    (plugin: Plugin) => {
      const { name, id, npm } = plugin;
      setPluginInstallationData(plugin);
      setIsCreatePluginInstallation(true);

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

  const [createDefaultAuthEntity] = useMutation<TEntities>(
    CREATE_DEFAULT_ENTITIES,
    {
      refetchQueries: [FIND_MODULES],
      onCompleted: (data) => {
        if (!data) return;
        const userEntity = data.createDefaultAuthEntity;
        addEntity(userEntity.id);
        refetch();
        setConfirmInstall(false);

        if (isCreatePluginInstallation) {
          const { name, id, npm } = pluginInstallationData;

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

  const handleCreateDefaultAuthEntityConfirmation = useCallback(() => {
    createDefaultAuthEntity({
      variables: {
        data: {
          resourceId: resource,
        },
      },
    }).catch(console.error);
  }, [createDefaultAuthEntity, resource]);

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
        handleCreateDefaultAuthEntityConfirmation={
          handleCreateDefaultAuthEntityConfirmation
        }
      ></PluginInstallConfirmationDialog>
      <TabContentTitle title={TITLE} subTitle={SUB_TITLE} />
      <DndProvider backend={HTML5Backend}>
        <List>
          {pluginInstallations.length &&
            pluginInstallations.map(
              (installation) =>
                installation && (
                  <PluginsCatalogItem
                    key={installation.id}
                    plugin={
                      pluginCatalog[installation.pluginId] ||
                      (privatePluginCatalog &&
                        privatePluginCatalog[installation.pluginId])
                    }
                    pluginInstallation={
                      installation as models.PluginInstallation
                    }
                    onOrderChange={onOrderChange}
                    onInstall={handleInstall}
                    onEnableStateChange={onEnableStateChange}
                    order={pluginOrderObj[installation.pluginId]}
                    isDraggable
                  />
                )
            )}
        </List>
        <Snackbar
          open={Boolean(updateError || createError)}
          message={errorMessage}
        />
      </DndProvider>
    </div>
  ) : (
    <>
      <TabContentTitle title={TITLE} subTitle={SUB_TITLE} />
      <EmptyState
        image={EnumImages.PluginInstallationEmpty}
        message="There are no plugins to show"
      >
        <Link to={`${baseUrl}/plugins/catalog`}>
          <Button buttonStyle={EnumButtonStyle.Primary}>Install Plugins</Button>
        </Link>
      </EmptyState>
    </>
  );
};

export default InstalledPlugins;
