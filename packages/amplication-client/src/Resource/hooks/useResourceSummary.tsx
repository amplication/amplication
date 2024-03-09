import { useQuery } from "@apollo/client";
import useModule from "../../Modules/hooks/useModule";
import { GET_ROLES } from "../../Roles/RoleList";
import { DATE_CREATED_FIELD } from "../../Modules/ModuleNavigationList";
import * as models from "../../models";
import { useEffect, useState } from "react";
import { GET_CATEGORIES } from "./categoriesQueries";
import usePlugins from "../../Plugins/hooks/usePlugins";

type TData = {
  resourceRoles: models.ResourceRole[];
};

interface SummaryData {
  models: number;
  apis: number;
  installedPlugins: number;
  roles: number;
}

export type PluginCategory = {
  id: string;
  name: string;
  description: string;
  rank: number;
  icon: string;
};

export const useResourceSummary = (currentResource: models.Resource) => {
  const [rankedCategories, setRankedCategories] = useState<PluginCategory[]>(
    []
  );

  const [summaryData, setSummaryData] = useState<SummaryData>({
    models: 0,
    apis: 0,
    installedPlugins: 0,
    roles: 0,
  });
  const { pluginInstallations } = usePlugins(currentResource.id);

  const { data: categoriesData } = useQuery<{
    categories: PluginCategory[];
  }>(GET_CATEGORIES, {
    context: {
      clientName: "pluginApiHttpLink",
    },
    variables: {},
    skip: !currentResource.id,
  });

  const { findModulesData } = useModule();

  const { data: rolesData } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: currentResource.id,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
    skip: !currentResource.id,
  });

  useEffect(() => {
    if (!pluginInstallations && !pluginInstallations?.length) return;
    if (!categoriesData && !categoriesData?.categories.length) return;

    const sortedCategories = categoriesData.categories.sort(
      (a, b) => a.rank - b.rank
    );

    setRankedCategories(sortedCategories.slice(0, 4));
  }, [pluginInstallations, categoriesData]);

  useEffect(() => {
    const models = currentResource?.entities.length;
    const modules = findModulesData?.modules.length;
    const installedPlugins = pluginInstallations?.length;
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
        pluginInstallations.length !== summaryData.installedPlugins
          ? { installedPlugins: pluginInstallations.length }
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
    rankedCategories,
  };
};
