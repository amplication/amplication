import { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import { GET_USER_ACTION } from "./queries";
import { AppContext } from "../context/appContext";

const POLL_INTERVAL = 2000;

type TGetUserAction = {
  userAction: models.UserAction;
};

/**
 * Pulls updates of the userAction from the server as long as the user action is still in progress
 */
const useUserActionWatchStatus = (
  userAction?: models.UserAction
): { data: { userAction?: models.UserAction } } => {
  const { addBlock } = useContext(AppContext);
  const { data, startPolling, stopPolling, refetch } = useQuery<TGetUserAction>(
    GET_USER_ACTION,
    {
      variables: {
        userActionId: userAction?.id,
      },
      skip: !userAction?.id || !shouldReload(userAction),
    }
  );

  //stop polling when user action log process completed
  useEffect(() => {
    if (!shouldReload(data?.userAction)) {
      stopPolling();
      addBlock(data?.userAction.id);
    } else {
      startPolling(POLL_INTERVAL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, stopPolling, startPolling]);

  useEffect(() => {
    if (userAction) refetch();
  }, [refetch, userAction]);

  //cleanup polling
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return { data: data || { userAction } };
};

export default useUserActionWatchStatus;

function shouldReload(userAction: models.UserAction | undefined): boolean {
  return (
    (userAction &&
      userAction?.status === models.EnumUserActionStatus.Running) ||
    false
  );
}
