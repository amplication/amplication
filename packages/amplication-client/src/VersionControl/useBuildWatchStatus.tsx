import { useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import * as models from "../models";

const POLL_INTERVAL = 1000;
/**
 * Pulls updates of the build from the server as long as the build process is still active
 */
const useBuildWatchStatus = (build: models.Build) => {
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
};

export default useBuildWatchStatus;

function shouldReload(build: models.Build | undefined): boolean {
  return (
    (build &&
      (build.status === models.EnumBuildStatus.Running ||
        build.deployments?.some(
          (deployment) =>
            deployment.status === models.EnumDeploymentStatus.Waiting
        ))) ||
    false
  );
}

export const GET_BUILD = gql`
  query build($buildId: String!) {
    build(where: { id: $buildId }) {
      id
      createdAt
      appId
      version
      message
      createdAt
      actionId
      action {
        id
        steps {
          id
          name
          completedAt
          status
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
      deployments {
        id
        createdAt
        actionId
        status
        environment {
          id
          name
          address
          url
        }
      }
    }
  }
`;
