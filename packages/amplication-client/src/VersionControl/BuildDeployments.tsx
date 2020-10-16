import React from "react";
import { Icon } from "@rmwc/icon";
import * as models from "../models";

import { SHOW_DEPLOYER } from "../feature-flags";
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
              <div className={`${CLASS_NAME}__deployment__progress-bar`} />
            </>
          )}
          {deployment.status === models.EnumDeploymentStatus.Completed && (
            <div className={`${CLASS_NAME}__deployment__details`}>
              <Icon icon={{ icon: "publish", size: "medium" }} />
              <div className={`${CLASS_NAME}__deployment__details__status`}>
                Your app is ready.
              </div>
              <div className={`${CLASS_NAME}__deployment__details__notice`}>
                <a href={deployment.environment.url} target="app">
                  {deployment.environment.url}
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BuildDeployments;
