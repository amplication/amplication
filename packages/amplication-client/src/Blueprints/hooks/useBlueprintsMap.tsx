import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_BLUEPRINTS_MAP } from "../queries/blueprintsQueries";
type TFindData = {
  blueprints: models.Blueprint[];
};

const useBlueprintsMap = () => {
  const [blueprintsMap, setBlueprintsMap] = useState<
    Record<string, models.Blueprint>
  >({});

  useQuery<TFindData>(GET_BLUEPRINTS_MAP, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data) {
        const blueprintsMap = data.blueprints.reduce((acc, blueprint) => {
          acc[blueprint.key] = blueprint;
          return acc;
        }, {} as Record<string, models.Blueprint>);
        setBlueprintsMap(blueprintsMap);
        return;
      }

      setBlueprintsMap({});
    },
  });

  return {
    blueprintsMap,
  };
};

export default useBlueprintsMap;
