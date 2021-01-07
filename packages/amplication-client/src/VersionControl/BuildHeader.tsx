import React from "react";
import { Icon } from "@rmwc/icon";
import { head } from "lodash";

import * as models from "../models";
import { ClickableId } from "../Components/ClickableId";

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
      <ClickableId
        to={`/${build.appId}/builds/${build.id}`}
        id={build.id}
        label="Build ID"
        eventData={{
          eventName: "buildHeaderIdClick",
        }}
      />
      <span className="spacer" />
      {deployment && isDeployed && (
        <a href={deployment.environment.address} target="app">
          <Icon icon="link_2" />
        </a>
      )}
    </div>
  );
};

export default BuildHeader;
