import { useQuery } from "@apollo/client";

import { GET_RESOURCE_SETTINGS } from "./GenerationSettingsForm";
import * as models from "../../models";
export const useResource = (resourceId: string) => {
  const { data, error, refetch } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });

  return {
    data: data?.serviceSettings,
    error: error,
    refetch: refetch,
  };
};
