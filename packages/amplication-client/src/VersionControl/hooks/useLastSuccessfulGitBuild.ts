import { useQuery } from "@apollo/client";
import * as models from "../../models";
import { GET_LAST_SUCCESSFUL_GIT_BUILD } from "./buildQueries";
import { useMemo } from "react";

export const useLastSuccessfulGitBuild = (resourceId: string) => {
  const { data, error, loading } = useQuery<{
    builds: models.Build[];
  }>(GET_LAST_SUCCESSFUL_GIT_BUILD, {
    variables: {
      resourceId,
    },
  });

  const buildPluginVersionMap = useMemo(() => {
    const lastBuild = data?.builds?.length && data.builds[0];

    const map: Record<string, string> = {};
    if (lastBuild) {
      lastBuild.buildPlugins.forEach((pluginVersion) => {
        map[pluginVersion.packageName] = pluginVersion.packageVersion;
      });
    }
    return map;
  }, [data]);

  return {
    build: (data?.builds?.length && data.builds[0]) || null,
    buildPluginVersionMap,
    error,
    loading,
  };
};
