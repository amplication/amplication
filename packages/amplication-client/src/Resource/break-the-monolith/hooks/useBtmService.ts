import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import {
  FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES,
  TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES,
} from "../queries";
import {
  BreakServiceToMicroservicesResult,
  EnumUserActionStatus,
  UserAction,
} from "../../../models";

const POLL_INTERVAL = 3000;

type TTriggerBreakServiceIntoMicroservices = {
  triggerBreakServiceIntoMicroservices: UserAction;
};

type TBreakServiceToMicroservicesResult = {
  finalizeBreakServiceIntoMicroservices: BreakServiceToMicroservicesResult;
};

type BtmProps = {
  resourceId: string;
};

export const useBtmService = ({ resourceId }: BtmProps) => {
  const [userAction, setUserAction] = useState<UserAction | null>(null);

  const [
    triggerBreakServiceIntoMicroservices,
    {
      loading: triggerBreakServiceIntoMicroservicesLoading,
      error: triggerBreakServiceIntoMicroservicesError,
    },
  ] = useMutation<TTriggerBreakServiceIntoMicroservices>(
    TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES,
    {
      variables: { resourceId },
      onCompleted: (data) => {
        setUserAction(data.triggerBreakServiceIntoMicroservices);
        finalizeBreakServiceIntoMicroservices({
          variables: {
            userActionId: data.triggerBreakServiceIntoMicroservices.id,
          },
        });
      },
    }
  );

  const [
    finalizeBreakServiceIntoMicroservices,
    {
      data: btmResult,
      loading: btmLoading,
      error: btmError,
      startPolling,
      stopPolling,
    },
  ] = useLazyQuery<TBreakServiceToMicroservicesResult>(
    FINALIZE_BREAK_SERVICE_INTO_MICROSERVICES,
    {
      variables: { userActionId: userAction?.id },
    }
  );

  const shouldReload = useCallback(
    (btmResult: BreakServiceToMicroservicesResult) => {
      return btmResult?.status === EnumUserActionStatus.Running;
    },
    []
  );

  useEffect(() => {
    if (!btmResult) return;
    if (
      !shouldReload(btmResult?.finalizeBreakServiceIntoMicroservices) ||
      btmError
    ) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [btmResult, btmError, stopPolling, startPolling, shouldReload]);

  useEffect(() => {
    triggerBreakServiceIntoMicroservices().catch(console.error);
  }, []);

  const hasError = Boolean(
    triggerBreakServiceIntoMicroservicesError || btmError
  );

  const isLoading =
    !hasError &&
    (triggerBreakServiceIntoMicroservicesLoading ||
      btmLoading ||
      btmResult?.finalizeBreakServiceIntoMicroservices.status ===
        EnumUserActionStatus.Running);

  return {
    btmResult: btmResult?.finalizeBreakServiceIntoMicroservices,
    loading: isLoading,
    error: triggerBreakServiceIntoMicroservicesError || btmError,
  };
};
