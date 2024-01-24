import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES } from "../queries";
import { BreakServiceToMicroservicesResult } from "../../../models";

type TBreakServiceToMicroservicesResult = {
  finalizeBreakServiceIntoMicroservices: BreakServiceToMicroservicesResult;
};

export function useFinalizeBreakServiceIntoMicroservices(userActionId: string) {
  const { data, loading, error, startPolling, stopPolling } =
    useQuery<TBreakServiceToMicroservicesResult>(
      FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES,
      {
        variables: { userActionId },
        notifyOnNetworkStatusChange: true,
        skip: !userActionId,
      }
    );

  useEffect(() => {
    const pollInterval = 3000;
    if (!data) {
      console.log("start polling");
      startPolling(pollInterval);
    } else {
      console.log("stop polling");
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [data, startPolling, stopPolling]);

  return { data, loading, error };
}
