import { useQuery } from "@apollo/client";
import useModule from "../../Modules/hooks/useModule";
import { GET_ROLES } from "../../Roles/RoleList";
import { DATE_CREATED_FIELD } from "../../Modules/ModuleNavigationList";
import * as models from "../../models";
import { useEffect, useState } from "react";
import { GET_CATEGORIES } from "./categoriesQueries";
import usePlugins, {
  SortedPluginInstallation,
} from "../../Plugins/hooks/usePlugins";

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

type UsedCategory = {
  category: PluginCategory;
  installedPlugin: SortedPluginInstallation[];
};

export const useResourceSummary = (currentResource: models.Resource) => {
  const [usedCategories, setUsedCategories] = useState<{
    [key: string]: UsedCategory;
  }>({});

  const [availableCategories, setAvailableCategories] = useState<
    PluginCategory[]
  >([]);

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

    const sortedCategories = categoriesData.categories.sort((a, b) => {
      // Check if either rank is null, and sort accordingly
      if (a.rank === null) return 1; // a is greater, as we want nulls at the end
      if (b.rank === null) return -1; // b is greater, for the same reason

      // If neither rank is null, proceed with numerical comparison
      return a.rank - b.rank;
    });

    const installedCategories = pluginInstallations.reduce((acc, plugin) => {
      const categories = plugin.categories || [];
      categories.forEach((category) => {
        acc[category] = acc[category] || {
          category: sortedCategories.find((c) => c.id === category),
          installedPlugin: [],
        };
        acc[category].installedPlugin.push(plugin);
      });

      return acc;
    }, {} as { [key: string]: UsedCategory });

    const availableCategories = sortedCategories.filter(
      (category) =>
        !installedCategories[category.name] && category.rank !== null
    );

    setUsedCategories(installedCategories);
    setAvailableCategories(availableCategories);
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
    usedCategories,
    availableCategories,
  };
};
