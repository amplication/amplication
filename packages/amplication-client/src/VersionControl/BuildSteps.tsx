import React, { useCallback, useMemo } from "react";
import download from "downloadjs";
import { Icon } from "@rmwc/icon";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";

import useBuildWatchStatus from "./useBuildWatchStatus";

import { STEP_STATUS_TO_ICON } from "./constants";

import "./BuildSteps.scss";

const CLASS_NAME = "build-steps";

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

const BuildSteps = ({ build, onError }: Props) => {
  const { data } = useBuildWatchStatus(build);

  const handleDownloadClick = useCallback(() => {
    downloadArchive(data.build.archiveURI).catch(onError);
  }, [data.build.archiveURI, onError]);

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
    <div>
      <div className={`${CLASS_NAME}__step`}>
        <BuildStepsStatus status={stepGenerateCode.status} />
        <Icon icon="code1" />
        <span>Generate Code</span>
        <span className="spacer" />
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="download"
          disabled={
            stepGenerateCode.status !== models.EnumActionStepStatus.Success
          }
          onClick={handleDownloadClick}
          eventData={{
            eventName: "downloadBuild",
            versionNumber: data.build.version,
          }}
        />
      </div>
      <div className={`${CLASS_NAME}__step`}>
        <BuildStepsStatus status={stepBuildDocker.status} />
        <Icon icon="docker" />
        <span>Build Container</span>
        <span className="spacer" />

        {/*@todo: add missing endpoint to download container and remove className */}
        <Button
          className="hidden"
          buttonStyle={EnumButtonStyle.Clear}
          icon="download"
          disabled={data.build.status !== models.EnumBuildStatus.Completed}
          onClick={handleDownloadClick}
          eventData={{
            eventName: "downloadBuild",
            versionNumber: data.build.version,
          }}
        />
      </div>
      <div className={`${CLASS_NAME}__step`}>
        <BuildStepsStatus status={stepDeploy.status} />
        <Icon icon="publish" />
        <span>Preview App</span>
        <span className="spacer" />

        {deployment &&
          stepDeploy.status === models.EnumActionStepStatus.Success && (
            <a href={deployment.environment.address} target="app">
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                icon="link_2"
                eventData={{
                  eventName: "openPreviewApp",
                  versionNumber: data.build.version,
                }}
              />
            </a>
          )}
      </div>
    </div>
  );
};

export default BuildSteps;

type BuildStepsStatusProps = {
  status: models.EnumActionStepStatus;
};

export const BuildStepsStatus = ({ status }: BuildStepsStatusProps) => {
  return (
    <span
      className={`${CLASS_NAME}__step__status ${CLASS_NAME}__step__status--${status.toLowerCase()}`}
    >
      {status === models.EnumActionStepStatus.Running ? (
        <CircularProgress size={"xsmall"} />
      ) : (
        <Icon icon={STEP_STATUS_TO_ICON[status]} />
      )}
    </span>
  );
};

async function downloadArchive(uri: string): Promise<void> {
  const res = await fetch(uri);
  const url = new URL(res.url);
  switch (res.status) {
    case 200: {
      const blob = await res.blob();
      download(blob, url.pathname);
      break;
    }
    case 404: {
      throw new Error("File not found");
    }
    default: {
      throw new Error(await res.text());
    }
  }
}
