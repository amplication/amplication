import { useEffect, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import * as models from "../models";

const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";

const POLL_INTERVAL = 1000;
/**
 * Pulls updates of the build from the server as long as the build process is still active
 */
const useBuildWatchStatus = (build: models.Build) => {
  //check if the build process completed
  const buildProcessCompleted = useMemo(() => {
    if (!build.action?.steps?.length) return false;
    const steps = build.action.steps;

    const result =
      steps.find((step) => step.name === GENERATE_STEP_NAME) &&
      steps.find((step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME) &&
      steps.every((step) => step.completedAt);
    return result;
  }, [build]);

  const { startPolling, stopPolling } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    onCompleted: () => {
      //Start polling if build process is still running
      if (!buildProcessCompleted) {
        startPolling(POLL_INTERVAL);
      }
    },
    variables: {
      buildId: build.id,
    },
    skip: buildProcessCompleted,
  });

  //stop polling when build process completed
  useEffect(() => {
    if (buildProcessCompleted) {
      stopPolling();
    }
  }, [buildProcessCompleted, stopPolling]);

  //cleanup polling
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return null;
};

export default useBuildWatchStatus;

const GET_BUILD = gql`
  query build($buildId: String!) {
    build(where: { id: $buildId }) {
      id
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
