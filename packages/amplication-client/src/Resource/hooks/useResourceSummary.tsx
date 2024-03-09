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

export const useResourceSummary = (currentResource: models.Resource) => {
  const [rankedCategories, setRankedCategories] = useState<
    { name: string; description: string }[]
  >([]);
  const [rankedInstalledCategories, setRankedInstalledCategories] = useState<
    { name: string; icon?: string; pluginsIcons?: string[] }[]
  >([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    models: 0,
    apis: 0,
    installedPlugins: 0,
    roles: 0,
  });
  const { pluginInstallations } = usePlugins(currentResource.id);

  const { data: categoriesData } = useQuery<{
    categories: { name: string; rank: number }[];
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

    const installedPluginsMap = pluginInstallations.reduce(
      (pluginObj, plugin) => {
        if (!plugin.categories) return pluginObj;

        plugin.categories.forEach((category) => {
          if (!Object.prototype.hasOwnProperty.call(pluginObj, category))
            pluginObj[category] = true;
        });

        return pluginObj;
      },
      {}
    );

    const tempRankedCategory = categoriesData.categories.reduce(
      (rankedArr, category) => {
        if (
          !Object.prototype.hasOwnProperty.call(
            installedPluginsMap,
            category.name
          )
        )
          rankedArr.push({
            ...category,
            description:
              "Connect and manage message queues for efficient data transfer.",
          });
        return rankedArr;
      },
      []
    );

    setRankedCategories(tempRankedCategory.slice(0, 4));
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
