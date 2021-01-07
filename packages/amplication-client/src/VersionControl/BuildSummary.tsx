import React, { useCallback, useMemo } from "react";

import { Link } from "react-router-dom";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { downloadArchive } from "./BuildSteps";

import useBuildWatchStatus from "./useBuildWatchStatus";
import { BuildStepsStatus } from "./BuildStepsStatus";
import { useTracking } from "../util/analytics";

import "./BuildSummary.scss";

const CLASS_NAME = "build-summary";

export const EMPTY_STEP: models.ActionStep = {
  id: "",
  createdAt: null,
  name: "",
  status: models.EnumActionStepStatus.Waiting,
  message: "",
};

export const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
export const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";
export const DEPLOY_STEP_NAME = "DEPLOY_APP";

type Props = {
  build: models.Build;
  onError: (error: Error) => void;
};

const BuildSummary = ({ build, onError }: Props) => {
  const { data } = useBuildWatchStatus(build);
  const { trackEvent } = useTracking();

  const handleDownloadClick = useCallback(() => {
    downloadArchive(data.build.archiveURI).catch(onError);
  }, [data.build.archiveURI, onError]);

  const handleViewBuildClick = useCallback(() => {
    trackEvent({
      eventName: "BuildSandboxViewDetailsClick",
    });
  }, [trackEvent]);

  const stepGenerateCode = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find(
        (step) => step.name === GENERATE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [data.build.action]);

  const stepBuildDocker = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [data.build.action]);

  const stepDeploy = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find((step) => step.name === DEPLOY_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [data.build.action]);

  const deployment =
    data.build.deployments &&
    data.build.deployments.length &&
    data.build.deployments[0];

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__download`}>
        <Button
          buttonStyle={EnumButtonStyle.Primary}
          disabled={
            stepGenerateCode.status !== models.EnumActionStepStatus.Success
          }
          onClick={handleDownloadClick}
          eventData={{
            eventName: "downloadBuild",
            versionNumber: data.build.version,
          }}
        >
          Download Code
        </Button>
      </div>
      {stepBuildDocker.status === models.EnumActionStepStatus.Running ||
      stepDeploy.status === models.EnumActionStepStatus.Running ? (
        <div className={`${CLASS_NAME}__sandbox`}>
          <BuildStepsStatus status={models.EnumActionStepStatus.Running} />
          <span>
            We prepare your sandbox environment. It may take around 5 minutes,
            keep working and come back later.{" "}
            <Link
              to={`/${build.appId}/builds/${build.id}`}
              onClick={handleViewBuildClick}
            >
              {" "}
              View Details
            </Link>
          </span>
        </div>
      ) : deployment &&
        stepDeploy.status === models.EnumActionStepStatus.Success ? (
        <a href={deployment.environment.address} target="app">
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            eventData={{
              eventName: "openPreviewApp",
              versionNumber: data.build.version,
            }}
          >
            Open Sandbox environment
          </Button>
        </a>
      ) : (
        <div className={`${CLASS_NAME}__sandbox`}>
          <BuildStepsStatus status={models.EnumActionStepStatus.Failed} />
          <span>
            Deployment to sandbox environment failed.{" "}
            <Link
              to={`/${build.appId}/builds/${build.id}`}
              onClick={handleViewBuildClick}
            >
              {" "}
              View Details
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};

export default BuildSummary;
