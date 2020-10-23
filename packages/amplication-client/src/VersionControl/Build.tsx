import React, { useCallback, useMemo } from "react";
import download from "downloadjs";
import { Icon } from "@rmwc/icon";
import { head } from "lodash";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import UserAndTime from "../Components/UserAndTime";
import CircleIcon, {
  EnumCircleIconStyle,
  EnumCircleIconSize,
} from "../Components/CircleIcon";
import { Link } from "react-router-dom";

import { SHOW_DEPLOYER } from "../feature-flags";
import useBuildWatchStatus from "./useBuildWatchStatus";
import BuildDeployments from "./BuildDeployments";
import ProgressBar from "../Components/ProgressBar";

import "./Build.scss";

const CLASS_NAME = "build";

const STEP_STATUS_TO_STYLE: {
  [key in models.EnumActionStepStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.EnumActionStepStatus.Waiting]: {
    style: EnumCircleIconStyle.Warning,
    icon: "info_i",
  },
  [models.EnumActionStepStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "info_i",
  },
  [models.EnumActionStepStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumActionStepStatus.Success]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

const BUILD_STATUS_TO_STYLE: {
  [key in models.EnumBuildStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.EnumBuildStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Invalid]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Completed]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

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
  open: boolean;
};

const Build = ({ build, onError, open }: Props) => {
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
    <PanelCollapsible
      className={`${CLASS_NAME}`}
      initiallyOpen={open}
      headerContent={
        <BuildHeader build={data.build} deployments={data.build.deployments} />
      }
    >
      <ul className="panel-list">
        <li>
          <div className={`${CLASS_NAME}__section-title`}>
            <span>Build details</span>
            <Link to={`/${data.build.appId}/builds/${data.build.id}`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                icon="option_set"
                eventData={{
                  eventName: "viewBuildLog",
                  versionNumber: data.build.version,
                }}
              />
            </Link>
          </div>
          <div className={`${CLASS_NAME}__message`}>{data.build.message}</div>
          <div className={`${CLASS_NAME}__step`}>
            <Icon icon="code1" />
            <span>Generate Code</span>
            <span className="spacer" />
            <CircleIcon
              size={EnumCircleIconSize.Small}
              {...STEP_STATUS_TO_STYLE[stepGenerateCode.status]}
            />
            <span className={`${CLASS_NAME}__step__status`}>
              {stepGenerateCode.status}
            </span>

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
            <span>Build Docker Container</span>
            <span className="spacer" />
            <CircleIcon
              size={EnumCircleIconSize.Small}
              {...STEP_STATUS_TO_STYLE[stepBuildDocker.status]}
            />
            <span className={`${CLASS_NAME}__step__status`}>
              {stepBuildDocker.status}
            </span>
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
        </li>
      </ul>

      {SHOW_DEPLOYER &&
        data.build.status === models.EnumBuildStatus.Completed && (
          <BuildDeployments build={data.build} />
        )}
    </PanelCollapsible>
  );
};

export default Build;

type BuildHeaderProps = {
  build: models.Build;
  deployments: models.Deployment[] | null;
};

const BuildHeader = ({ build, deployments }: BuildHeaderProps) => {
  const account = build.createdBy?.account;

  const deployedClassName = `${CLASS_NAME}__header--deployed`;

  const deployment = head(deployments);
  const isDeployed =
    deployment && deployment.status === models.EnumDeploymentStatus.Completed;

  return (
    <div
      className={`${CLASS_NAME}__header ${isDeployed && deployedClassName} `}
    >
      <h3>
        Version<span>{build.version}</span>
      </h3>
      {isDeployed ? (
        <>
          <Icon icon="publish" />
          <a href={deployment.environment.address} target="app">
            <Icon icon="link_2" />
          </a>
        </>
      ) : (
        <>
          <CircleIcon
            size={EnumCircleIconSize.Small}
            {...BUILD_STATUS_TO_STYLE[
              build.status || models.EnumBuildStatus.Invalid
            ]}
          />

          <span>{build.status}</span>
        </>
      )}
      <span className="spacer" />
      <UserAndTime account={account} time={build.createdAt} />
    </div>
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
