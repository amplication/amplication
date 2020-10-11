import { useEffect, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import * as models from "../models";

const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";

export enum BuildProcessStatus {
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
}

const POLL_INTERVAL = 1000;
/**
 * Pulls updates of the build from the server as long as the build process is still active
 * @returns True when the build process completed, false otherwise
 */
const useBuildWatchStatus = (build: models.Build): BuildProcessStatus => {
  //check if the build process completed
  const buildStatus = useMemo(() => {
    if (!build.action?.steps?.length) return BuildProcessStatus.Running;
    const steps = build.action.steps;

    const stepGenerate = steps.find((step) => step.name === GENERATE_STEP_NAME);
    const stepBuildDocker = steps.find(
      (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
    );

    if (
      stepGenerate?.status === models.EnumActionStepStatus.Success &&
      stepBuildDocker?.status === models.EnumActionStepStatus.Success
    )
      return BuildProcessStatus.Completed;

    if (
      stepGenerate?.status === models.EnumActionStepStatus.Failed ||
      stepBuildDocker?.status === models.EnumActionStepStatus.Failed
    )
      return BuildProcessStatus.Failed;

    return BuildProcessStatus.Running;
  }, [build]);

  const { startPolling, stopPolling } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    onCompleted: () => {
      //Start polling if build process is still running
      if (buildStatus === BuildProcessStatus.Running) {
        startPolling(POLL_INTERVAL);
      }
    },
    variables: {
      buildId: build.id,
    },
    skip: buildStatus !== BuildProcessStatus.Running,
  });

  //stop polling when build process completed
  useEffect(() => {
    if (buildStatus !== BuildProcessStatus.Running) {
      stopPolling();
    }
  }, [buildStatus, stopPolling]);

  //cleanup polling
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return buildStatus;
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
    }
  }
`;
