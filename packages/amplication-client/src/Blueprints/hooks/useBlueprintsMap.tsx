import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_BLUEPRINTS_MAP } from "../queries/blueprintsQueries";
type TFindData = {
  blueprints: models.Blueprint[];
};

export interface IBlueprintsMap {
  ready: boolean;
  blueprintsMap: Record<string, models.Blueprint>;
  blueprintsMapById: Record<string, models.Blueprint>;
}

const useBlueprintsMap = () => {
  const [blueprintsMap, setBlueprintsMap] = useState<
    Record<string, models.Blueprint>
  >({});

  const [blueprintsMapById, setBlueprintsMapById] = useState<
    Record<string, models.Blueprint>
  >({});

  const [ready, setReady] = useState(false);

  useQuery<TFindData>(GET_BLUEPRINTS_MAP, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data) {
        const blueprintsMap = data.blueprints.reduce((acc, blueprint) => {
          acc[blueprint.key] = blueprint;
          return acc;
        }, {} as Record<string, models.Blueprint>);
        setBlueprintsMap(blueprintsMap);

        const blueprintsMapById = data.blueprints.reduce((acc, blueprint) => {
          acc[blueprint.id] = blueprint;
          return acc;
        }, {} as Record<string, models.Blueprint>);
        setBlueprintsMapById(blueprintsMapById);

        setReady(true);

        return;
      }

      setBlueprintsMap({});
    },
  });

  return {
    ready,
    blueprintsMap,
    blueprintsMapById,
  };
};

export default useBlueprintsMap;
