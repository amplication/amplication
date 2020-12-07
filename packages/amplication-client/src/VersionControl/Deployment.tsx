import React from "react";
import { Icon } from "@rmwc/icon";
import { Link } from "react-router-dom";
import * as models from "../models";

import { EnumButtonStyle, Button } from "../Components/Button";
import {
  CircleIcon,
  EnumCircleIconStyle,
  EnumCircleIconSize,
} from "@amplication/design-system";
import ProgressBar from "../Components/ProgressBar";
import "./Deployment.scss";

const CLASS_NAME = "deployment";

type Props = {
  deployment: models.Deployment;
  applicationId: string;
};

const Deployment = ({ deployment, applicationId }: Props) => {
  return (
    <li className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__title`}>
        <span>Deployment details</span>

        <Link
          to={`/${applicationId}/builds/${deployment.buildId}/deployments/${deployment.id}`}
        >
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            icon="option_set"
            eventData={{
              eventName: "viewDeployLog",
              deploymentId: deployment.id,
            }}
          />
        </Link>
      </div>
      <div className={`${CLASS_NAME}__message`}>{deployment.message}</div>
      <div className={`${CLASS_NAME}__details`}>
        {deployment.status === models.EnumDeploymentStatus.Waiting && (
          <>
            <Icon icon={{ icon: "publish", size: "medium" }} />
            <div className={`${CLASS_NAME}__details__status`}>
              Your app is being deployed.
            </div>
            <div className={`${CLASS_NAME}__details__notice`}>
              This action may take a few minutes.
            </div>
            <ProgressBar startTime={deployment.createdAt} message="" />
          </>
        )}
        {deployment.status === models.EnumDeploymentStatus.Completed && (
          <>
            <Icon icon={{ icon: "publish", size: "medium" }} />
            <div className={`${CLASS_NAME}__details__status`}>
              Your app is ready.
            </div>
            <div className={`${CLASS_NAME}__details__notice`}>
              <a href={deployment.environment.address} target="app">
                {deployment.environment.address}
              </a>
            </div>
          </>
        )}
        {deployment.status === models.EnumDeploymentStatus.Failed && (
          <>
            <CircleIcon
              size={EnumCircleIconSize.Small}
              style={EnumCircleIconStyle.Negative}
              icon="info_i"
            />
            <div className={`${CLASS_NAME}__details__status`}>
              The deployment failed. see log for more details.
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default Deployment;
