import React from "react";
import { Icon } from "@rmwc/icon";
import { Link } from "react-router-dom";
import * as models from "../models";

import { EnumButtonStyle, Button } from "../Components/Button";
import CircleIcon, {
  EnumCircleIconStyle,
  EnumCircleIconSize,
} from "../Components/CircleIcon";
import { SHOW_DEPLOYER } from "../feature-flags";
import ProgressBar from "../Components/ProgressBar";
import "./BuildDeployments.scss";

const CLASS_NAME = "build-deployments";

type Props = {
  build: models.Build;
};

const BuildDeployments = ({ build }: Props) => {
  if (!SHOW_DEPLOYER) return null;

  return (
    <div className={CLASS_NAME}>
      {build.deployments?.map((deployment) => (
        <div key={deployment.id} className={`${CLASS_NAME}__deployment`}>
          <div className={`${CLASS_NAME}__deployment__message`}>
            {deployment.message}
          </div>

          {deployment.status === models.EnumDeploymentStatus.Waiting && (
            <>
              <div className={`${CLASS_NAME}__deployment__details`}>
                <Icon icon={{ icon: "publish", size: "medium" }} />
                <div className={`${CLASS_NAME}__deployment__details__status`}>
                  Your app is being deployed.
                </div>
                <div className={`${CLASS_NAME}__deployment__details__notice`}>
                  This action may take a few minutes.
                </div>
              </div>
              <ProgressBar startTime={deployment.createdAt} message="" />
            </>
          )}
          {deployment.status === models.EnumDeploymentStatus.Completed && (
            <div className={`${CLASS_NAME}__deployment__details`}>
              <Icon icon={{ icon: "publish", size: "medium" }} />
              <div className={`${CLASS_NAME}__deployment__details__status`}>
                Your app is ready.
              </div>
              <div className={`${CLASS_NAME}__deployment__details__notice`}>
                <a href={deployment.environment.address} target="app">
                  {deployment.environment.address}
                </a>
              </div>
            </div>
          )}
          {deployment.status === models.EnumDeploymentStatus.Failed && (
            <div className={`${CLASS_NAME}__deployment__details`}>
              <CircleIcon
                size={EnumCircleIconSize.Small}
                style={EnumCircleIconStyle.Negative}
                icon="info_i"
              />
              <div className={`${CLASS_NAME}__deployment__details__status`}>
                The deployment failed. see log for more details.
              </div>
            </div>
          )}
          <Link
            to={`/${build.appId}/builds/${build.id}/deployments/${deployment.id}`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="option_set"
              eventData={{
                eventName: "viewDeployLog",
                versionNumber: build.version,
              }}
            >
              View Log
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BuildDeployments;
