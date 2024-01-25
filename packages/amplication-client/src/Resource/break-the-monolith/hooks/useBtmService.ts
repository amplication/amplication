import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import {
  FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES,
  TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES,
} from "../queries";
import { BreakServiceToMicroservicesResult } from "../../../models";

const POOLING_INTERVAL = 3000;

type TTriggerBreakServiceIntoMicroservices = {
  triggerBreakServiceIntoMicroservices: {
    id: string;
  };
};

type TBreakServiceToMicroservicesResult = {
  finalizeBreakServiceIntoMicroservices: BreakServiceToMicroservicesResult;
};

type BtmProps = {
  resourceId: string;
  userActionId: string;
};

export const useBtmService = ({ userActionId, resourceId }: BtmProps) => {
  const [
    trigger,
    // {
    //   data: triggerBtmData,
    //   loading: triggerBtmLoading,
    //   error: triggerBtmError,
    // },
  ] = useMutation<TTriggerBreakServiceIntoMicroservices>(
    TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES
  );

  const {
    data: btmResult,
    loading: btmResultLoading,
    error: btmResultError,
    startPolling,
    stopPolling,
    refetch,
  } = useQuery<TBreakServiceToMicroservicesResult>(
    FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES,
    {
      variables: { userActionId },
      notifyOnNetworkStatusChange: true,
      skip: !userActionId,
    }
  );

  const triggerBreakTheMonolith = () => {
    return trigger({ variables: { resourceId } });
  };

  useEffect(() => {
    refetch().catch(console.error);
    startPolling(POOLING_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [btmResult, refetch, startPolling, stopPolling]);

  return {
    triggerBreakTheMonolith,
    // triggerBtmData,
    // triggerBtmLoading,
    // triggerBtmError,
    btmResult,
    btmResultLoading,
    btmResultError,
  };
};
