import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_CUSTOM_PROPERTIES_MAP } from "../queries/customPropertiesQueries";
type TFindData = {
  customProperties: models.CustomProperty[];
};

const useCustomPropertiesMap = () => {
  const [customPropertiesMap, setCustomPropertiesMap] = useState<
    Record<string, models.CustomProperty>
  >({});

  useQuery<TFindData>(GET_CUSTOM_PROPERTIES_MAP, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        enabled: true,
      },
    },
    onCompleted: (data) => {
      if (data) {
        const customPropertiesMap = data.customProperties.reduce(
          (acc, customProperty) => {
            acc[customProperty.key] = customProperty;
            return acc;
          },
          {} as Record<string, models.CustomProperty>
        );
        setCustomPropertiesMap(customPropertiesMap);
        return;
      }

      setCustomPropertiesMap({});
    },
  });

  return {
    customPropertiesMap,
  };
};

export default useCustomPropertiesMap;
