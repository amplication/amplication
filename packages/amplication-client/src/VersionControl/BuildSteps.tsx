import React, { useCallback, useMemo } from "react";
import download from "downloadjs";
import { Icon } from "@rmwc/icon";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import CircleIcon, { EnumCircleIconSize } from "../Components/CircleIcon";

import { SHOW_DEPLOYER } from "../feature-flags";
import useBuildWatchStatus from "./useBuildWatchStatus";
import BuildDeployments from "./BuildDeployments";
import ProgressBar from "../Components/ProgressBar";

import { STEP_STATUS_TO_STYLE } from "./constants";

import "./BuildSteps.scss";

const CLASS_NAME = "build-steps";

const EMPTY_STEP: models.ActionStep = {
  id: "",
  createdAt: null,
  name: "",
  status: models.EnumActionStepStatus.Waiting,
  message: "",
};

const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";

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

  return (
    <div>
      <div className={`${CLASS_NAME}__step`}>
        <Icon icon="code1" />
        <span>Generate Code</span>
        <span className="spacer" />
        <CircleIcon
          size={EnumCircleIconSize.Small}
          {...STEP_STATUS_TO_STYLE[stepGenerateCode.status]}
        />

        <Button
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
        <Icon icon="docker" />
        <span>Build Container</span>
        <span className="spacer" />
        <CircleIcon
          size={EnumCircleIconSize.Small}
          {...STEP_STATUS_TO_STYLE[stepBuildDocker.status]}
        />

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
      {data.build.status === models.EnumBuildStatus.Running && (
        <ProgressBar
          startTime={data.build.createdAt}
          message="Sit back while we build the new version. It should take around 2 minutes"
        />
      )}

      {SHOW_DEPLOYER &&
        data.build.status === models.EnumBuildStatus.Completed && (
          <BuildDeployments build={data.build} />
        )}
    </div>
  );
};

export default BuildSteps;

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
