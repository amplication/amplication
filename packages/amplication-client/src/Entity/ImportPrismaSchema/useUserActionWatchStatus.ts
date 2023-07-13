import { useEffect } from "react";
import { useQuery } from "@apollo/client";

import * as models from "../../models";
import { GET_USER_ACTION } from "./queries";

const POLL_INTERVAL = 5000;
/**
 * Pulls updates of the userAction from the server as long as the user action is still in progress
 */
const useUserActionWatchStatus = (
  userAction?: models.UserAction
): { data: { userAction?: models.UserAction } } => {
  const { data, startPolling, stopPolling, refetch } = useQuery<{
    userAction: models.UserAction;
  }>(GET_USER_ACTION, {
    variables: {
      userActionId: userAction?.id,
    },
    skip: !userAction?.id || !shouldReload(userAction),
  });

  //stop polling when build process completed
  useEffect(() => {
    if (!shouldReload(data?.userAction)) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [data, stopPolling, startPolling]);

  useEffect(() => {
    if (userAction) refetch();
  }, [userAction]);

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
