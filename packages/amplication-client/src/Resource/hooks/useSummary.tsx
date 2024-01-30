import { useQuery } from "@apollo/client";
import useModule from "../../Modules/hooks/useModule";
import { GET_ROLES } from "../../Roles/RoleList";
import { DATE_CREATED_FIELD } from "../../Modules/ModuleList";
import * as models from "../../models";
import { GET_PLUGIN_INSTALLATIONS } from "../../Plugins/queries/pluginsQueries";
import { useEffect, useState } from "react";

type TData = {
  resourceRoles: models.ResourceRole[];
};

interface SummaryData {
  models: number;
  apis: number;
  installedPlugins: number;
  roles: number;
}

export const useSummary = (currentResource: models.Resource) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    models: 0,
    apis: 0,
    installedPlugins: 0,
    roles: 0,
  });
  // categories

  const {
    data: pluginInstallations,
    loading: loadingPluginInstallations,
    error: errorPluginInstallations,
  } = useQuery<{
    pluginInstallations: models.PluginInstallation[];
  }>(GET_PLUGIN_INSTALLATIONS, {
    variables: {
      resourceId: currentResource.id,
    },
    skip: !currentResource.id,
  });
  const { findModulesData, findModulesError, findModulesLoading } = useModule();

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: currentResource.id,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
    skip: !currentResource.id,
  });

  useEffect(() => {
    const models = currentResource?.entities.length;
    const modules = findModulesData?.modules.length;
    const installedPlugins = pluginInstallations?.pluginInstallations.length;
    const roles = rolesData?.resourceRoles.length;
    if (
      summaryData.models !== models ||
      summaryData.apis !== modules ||
      summaryData.installedPlugins !== installedPlugins ||
      summaryData.roles !== roles
    ) {
      setSummaryData({
        ...summaryData,
        ...(summaryData.models !== currentResource.entities.length
          ? { models: currentResource.entities.length }
          : {}),
        ...(findModulesData &&
        findModulesData.modules.length !== summaryData.apis
          ? { apis: findModulesData.modules.length }
          : {}),
        ...(pluginInstallations &&
        pluginInstallations.pluginInstallations.length !==
          summaryData.installedPlugins
          ? { installedPlugins: pluginInstallations.pluginInstallations.length }
          : {}),
        ...(rolesData && rolesData.resourceRoles.length !== summaryData.roles
          ? { roles: rolesData.resourceRoles.length }
          : {}),
      });
    }
  }, [
    currentResource,
    summaryData,
    pluginInstallations,
    findModulesData,
    rolesData,
  ]);

  return {
    summaryData,
  };
};
