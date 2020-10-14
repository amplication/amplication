import React, { useCallback, useState, useMemo } from "react";
import download from "downloadjs";
import { Icon } from "@rmwc/icon";
import { isEmpty } from "lodash";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import UserAndTime from "../Components/UserAndTime";
import CircleIcon, {
  EnumCircleIconStyle,
  EnumCircleIconSize,
} from "../Components/CircleIcon";
import { Link } from "react-router-dom";
import { Dialog } from "../Components/Dialog";
import Deploy from "./Deploy";
import { SHOW_DEPLOYER } from "../feature-flags";
import useBuildWatchStatus from "./useBuildWatchStatus";
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
  const [deployDialogOpen, setDeployDialogOpen] = useState<boolean>(false);

  useBuildWatchStatus(build);

  const handleDownloadClick = useCallback(() => {
    downloadArchive(build.archiveURI).catch(onError);
  }, [build.archiveURI, onError]);

  const handleToggleDeployDialog = useCallback(() => {
    setDeployDialogOpen(!deployDialogOpen);
  }, [deployDialogOpen, setDeployDialogOpen]);

  const stepGenerateCode = useMemo(() => {
    if (!build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === GENERATE_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build]);

  const stepBuildDocker = useMemo(() => {
    if (!build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [build]);

  const deployments = useMemo(() => {
    if (!build.deployments?.length) {
      return null;
    }
    const list = build.deployments.filter(
      /**@todo: revert  status check after updating the statuses on the server side */
      (item) => item.status !== models.EnumDeploymentStatus.Completed
    );

    return (!isEmpty(list) && list) || null;
  }, [build]);

  return (
    <PanelCollapsible
      className={`${CLASS_NAME}`}
      initiallyOpen={open}
      headerContent={<BuildHeader build={build} deployments={deployments} />}
    >
      <Dialog
        className="deploy-dialog"
        isOpen={deployDialogOpen}
        onDismiss={handleToggleDeployDialog}
        title="Deploy your app"
      >
        <Deploy
          applicationId={build.appId}
          buildId={build.id}
          onComplete={handleToggleDeployDialog}
        />
      </Dialog>
      <ul className="panel-list">
        <li>
          <div className={`${CLASS_NAME}__message`}>{build.message}</div>
          <div className={`${CLASS_NAME}__step`}>
            <Icon icon="clock" />
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
              disabled={build.status !== models.EnumBuildStatus.Completed}
              onClick={handleDownloadClick}
              eventData={{
                eventName: "downloadBuild",
                versionNumber: build.version,
              }}
            />
          </div>
          <div className={`${CLASS_NAME}__step`}>
            <Icon icon="clock" />
            <span>Build Docker Container</span>
            <span className="spacer" />
            <CircleIcon
              size={EnumCircleIconSize.Small}
              {...STEP_STATUS_TO_STYLE[stepBuildDocker.status]}
            />
            <span className={`${CLASS_NAME}__step__status`}>
              {stepBuildDocker.status}
            </span>

            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="download"
              disabled={build.status !== models.EnumBuildStatus.Completed}
              onClick={handleDownloadClick}
              eventData={{
                eventName: "downloadBuild",
                versionNumber: build.version,
              }}
            />
          </div>
        </li>
        <li className={`${CLASS_NAME}__actions`}>
          <Link to={`/${build.appId}/builds/action/${build.actionId}`}>
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="option_set"
              eventData={{
                eventName: "viewBuildLog",
                versionNumber: build.version,
              }}
            >
              View Log
            </Button>
          </Link>
          {SHOW_DEPLOYER && (
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              icon="publish"
              disabled={build.status !== models.EnumBuildStatus.Completed}
              onClick={handleToggleDeployDialog}
              eventData={{
                eventName: "openDeploymentDialog",
                versionNumber: build.version,
              }}
            >
              Deploy
            </Button>
          )}
        </li>
      </ul>
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

  return (
    <div
      className={`${CLASS_NAME}__header ${deployments && deployedClassName} `}
    >
      <h3>
        Version<span>{build.version}</span>
      </h3>
      {deployments ? (
        <>
          <Icon icon="publish" />
          <a href={deployments[0].environment.address}>
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
