import React, { useCallback, useState } from "react";
import download from "downloadjs";
import { Icon } from "@rmwc/icon";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import UserAndTime from "../Components/UserAndTime";
import "./BuildList.scss";
import CircleIcon, { EnumCircleIconStyle } from "../Components/CircleIcon";
import { Link } from "react-router-dom";
import { Dialog } from "../Components/Dialog";
import Deploy from "./Deploy";
import useBuildWatchStatus from "./useBuildWatchStatus";
const CLASS_NAME = "build-list";

const BUILD_STATUS_TO_STYLE: {
  [key in models.EnumBuildStatus]: EnumCircleIconStyle;
} = {
  [models.EnumBuildStatus.Active]: EnumCircleIconStyle.Positive,
  [models.EnumBuildStatus.Completed]: EnumCircleIconStyle.Positive,
  [models.EnumBuildStatus.Failed]: EnumCircleIconStyle.Negative,
  [models.EnumBuildStatus.Paused]: EnumCircleIconStyle.Negative,
  [models.EnumBuildStatus.Delayed]: EnumCircleIconStyle.Negative,
  [models.EnumBuildStatus.Waiting]: EnumCircleIconStyle.Warning,
};

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

  const account = build.createdBy?.account;
  return (
    <PanelCollapsible
      className={`${CLASS_NAME}__build`}
      initiallyOpen={open}
      headerContent={
        <>
          <h3>
            Version<span>{build.version}</span>
          </h3>
          <UserAndTime account={account} time={build.createdAt} />
        </>
      }
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
          <div className={`${CLASS_NAME}__status`}>
            <Icon icon="clock" />
            <span>Generate Code</span>
            <span className="spacer" />
            <CircleIcon
              icon="info_i"
              style={BUILD_STATUS_TO_STYLE[build.status]}
            />
            <span>{build.status}</span>
            <Link to={`/${build.appId}/builds/action/${build.actionId}`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                icon="option_set"
                eventData={{
                  eventName: "viewBuildLog",
                  versionNumber: build.version,
                }}
              />
            </Link>
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
          <div className={`${CLASS_NAME}__status`}>
            <Icon icon="clock" />
            <span>Build Docker Container</span>
            <span className="spacer" />
            <CircleIcon
              icon="info_i"
              style={BUILD_STATUS_TO_STYLE[build.status]}
            />
            <span>{build.status}</span>
            <Link to={`/${build.appId}/builds/action/${build.actionId}`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                icon="option_set"
                eventData={{
                  eventName: "viewBuildLog",
                  versionNumber: build.version,
                }}
              />
            </Link>
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
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            icon="publish"
            /**@todo: merge with @iddan to complete the flow and remove the comment  */
            //disabled={build.status !== models.EnumBuildStatus.Completed}
            onClick={handleToggleDeployDialog}
            eventData={{
              eventName: "openDeploymentDialog",
              versionNumber: build.version,
            }}
          >
            Deploy
          </Button>
        </li>
      </ul>
    </PanelCollapsible>
  );
};

export default Build;

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
