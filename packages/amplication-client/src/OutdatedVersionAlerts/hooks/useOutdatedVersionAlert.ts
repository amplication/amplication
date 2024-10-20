import { useMutation, useQuery } from "@apollo/client";
import * as models from "../../models";
import {
  GET_OUTDATED_VERSION_ALERT,
  UPDATE_OUTDATED_VERSION_ALERT,
} from "./outdatedVersionAlertsQueries";

type TGetOutdatedVersionAlerts = {
  outdatedVersionAlert: models.OutdatedVersionAlert;
};

type TUpdateOutdatedVersionAlert = {
  updateOutdatedVersionAlert: models.OutdatedVersionAlert;
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

  const [updateAlert, { error: updateError, loading: updateLoading }] =
    useMutation<TUpdateOutdatedVersionAlert>(UPDATE_OUTDATED_VERSION_ALERT, {});

  return {
    outdatedVersionAlert: outdatedVersionAlert?.outdatedVersionAlert,
    loadingOutdatedVersionAlert,
    errorOutdatedVersionAlert,
    reloadOutdatedVersionAlert,
    updateAlert,
    updateError,
    updateLoading,
  };
};

export default useOutdatedVersionAlert;
