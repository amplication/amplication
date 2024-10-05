import { useQuery } from "@apollo/client";
import * as models from "../../models";
import { GET_OUTDATED_VERSION_ALERT } from "./outdatedVersionAlertsQueries";

type TGetOutdatedVersionAlerts = {
  outdatedVersionAlert: models.OutdatedVersionAlert;
};

const useOutdatedVersionAlert = (alertId: string) => {
  const {
    data: outdatedVersionAlert,
    loading: loadingOutdatedVersionAlert,
    error: errorOutdatedVersionAlert,
    refetch: reloadOutdatedVersionAlert,
  } = useQuery<TGetOutdatedVersionAlerts>(GET_OUTDATED_VERSION_ALERT, {
    variables: {
      alertId,
    },
    skip: !alertId,
  });

  return {
    outdatedVersionAlert: outdatedVersionAlert?.outdatedVersionAlert,
    loadingOutdatedVersionAlert,
    errorOutdatedVersionAlert,
    reloadOutdatedVersionAlert,
  };
};

export default useOutdatedVersionAlert;
