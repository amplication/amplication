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
import { TEMP_RESULT } from "./btm-results-mock";

const POLL_INTERVAL = 3000;

type TTriggerBreakServiceIntoMicroservices = {
  triggerBreakServiceIntoMicroservices: UserAction;
};

export type TBreakServiceToMicroservicesResult = {
  finalizeBreakServiceIntoMicroservices: BreakServiceToMicroservicesResult;
};

type BtmProps = {
  resourceId: string;
  useFakeData?: boolean;
};

export const useBtmService = ({ resourceId, useFakeData }: BtmProps) => {
  const [userAction, setUserAction] = useState<UserAction | null>(null);
  const [fakeDataLoading, setFakeDataLoading] = useState<boolean>(true);

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
    if (!shouldReload(btmResult?.finalizeBreakServiceIntoMicroservices)) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [btmResult, stopPolling, startPolling, shouldReload]);

  useEffect(() => {
    if (useFakeData) {
      setTimeout(() => {
        setFakeDataLoading(false);
      }, 3000);
    } else {
      triggerBreakServiceIntoMicroservices().catch(console.error);
    }
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

  TEMP_RESULT.finalizeBreakServiceIntoMicroservices.originalResourceId =
    resourceId;

  return {
    btmResult: useFakeData
      ? fakeDataLoading
        ? undefined
        : TEMP_RESULT.finalizeBreakServiceIntoMicroservices
      : btmResult?.finalizeBreakServiceIntoMicroservices,
    loading: useFakeData ? fakeDataLoading : isLoading,
    error: triggerBreakServiceIntoMicroservicesError || btmError,
  };
};
