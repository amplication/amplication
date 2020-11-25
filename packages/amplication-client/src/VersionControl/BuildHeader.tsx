import React from "react";
import { Icon } from "@rmwc/icon";
import { head } from "lodash";

import * as models from "../models";
import CircleIcon, { EnumCircleIconSize } from "../Components/CircleIcon";
import { Link } from "react-router-dom";

import { BUILD_STATUS_TO_STYLE } from "./constants";

import "./BuildHeader.scss";

const CLASS_NAME = "build-header";

type Props = {
  build: models.Build;
  deployments?: models.Deployment[] | null;
};

const BuildHeader = ({ build, deployments }: Props) => {
  const deployedClassName = `${CLASS_NAME}--deployed`;

  const deployment = head(deployments);

  const isDeployed =
    deployment && deployment.status === models.EnumDeploymentStatus.Completed;

  return (
    <div className={`${CLASS_NAME} ${isDeployed && deployedClassName} `}>
      <Link to={`/${build.appId}/builds/${build.id}`}>
        <span>{`Build #${build.version}`}</span>
      </Link>
      <span className="spacer" />

      {deployment && isDeployed ? (
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

export default BuildHeader;
