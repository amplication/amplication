import React from "react";
import { Icon } from "@rmwc/icon";
import { head } from "lodash";

import * as models from "../models";
import { Panel, EnumPanelStyle, PanelHeader } from "../Components/Panel";
import UserAndTime from "../Components/UserAndTime";
import CircleIcon, { EnumCircleIconSize } from "../Components/CircleIcon";
import { Link } from "react-router-dom";

import useBuildWatchStatus from "./useBuildWatchStatus";
import BuildSteps from "./BuildSteps";

import { BUILD_STATUS_TO_STYLE } from "./constants";

import "./Build.scss";

const CLASS_NAME = "build";

type Props = {
  build: models.Build;
  onError: (error: Error) => void;
  open: boolean;
};

const Build = ({ build, onError, open }: Props) => {
  const { data } = useBuildWatchStatus(build);

  const account = build.createdBy?.account;

  return (
    <Panel panelStyle={EnumPanelStyle.Transparent} className={`${CLASS_NAME}`}>
      <PanelHeader>Build details</PanelHeader>
      <div className={`${CLASS_NAME}__message`}>{data.build.message}</div>
      <UserAndTime account={account} time={build.createdAt} />
      <BuildHeader build={data.build} deployments={data.build.deployments} />

      <BuildSteps build={data.build} onError={onError} />
    </Panel>
  );
};

export default Build;

type BuildHeaderProps = {
  build: models.Build;
  deployments: models.Deployment[] | null;
};

const BuildHeader = ({ build, deployments }: BuildHeaderProps) => {
  const deployedClassName = `${CLASS_NAME}__header--deployed`;

  const deployment = head(deployments);
  const isDeployed =
    deployment && deployment.status === models.EnumDeploymentStatus.Completed;

  return (
    <div
      className={`${CLASS_NAME}__header ${isDeployed && deployedClassName} `}
    >
      <Link to={`/${build.appId}/builds/${build.id}`}>
        <span>{`Build #${build.version}`}</span>
      </Link>
      <span className="spacer" />

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
    </div>
  );
};
