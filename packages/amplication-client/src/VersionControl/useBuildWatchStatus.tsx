import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

import * as models from "../models";

const POLL_INTERVAL = 5000;
/**
 * Pulls updates of the build from the server as long as the build process is still active
 */
const useBuildWatchStatus = (
  build: models.Build
): { data: { build: models.Build } } => {
  const { data, startPolling, stopPolling } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    onCompleted: () => {
      //Start polling if build process is still running
      if (shouldReload(build)) {
        startPolling(POLL_INTERVAL);
      }
    },
    variables: {
      buildId: build.id,
    },
    skip: !shouldReload(build),
  });

  //stop polling when build process completed
  useEffect(() => {
    if (!shouldReload(data?.build)) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [data, stopPolling, startPolling]);

  //cleanup polling
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return { data: data || { build } };
};

export default useBuildWatchStatus;

function shouldReload(build: models.Build | undefined): boolean {
  return (build && build.status === models.EnumBuildStatus.Running) || false;
}

export const GET_BUILD = gql`
  query build($buildId: String!) {
    build(where: { id: $buildId }) {
      id
      createdAt
      resourceId
      version
      message
      createdAt
      commitId
      actionId
      action {
        id
        createdAt
        steps {
          id
          name
          createdAt
          message
          status
          completedAt
          logs {
            id
            createdAt
            message
            meta
            level
          }
        }
      }
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      archiveURI
    }
  }
`;
