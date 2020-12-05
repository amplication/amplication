import React, { useCallback, useState } from "react";
import * as models from "../models";
import { head } from "lodash";

import { EnumButtonStyle, Button } from "../Components/Button";
import { Dialog } from "@amplication/design-system";
import Deploy from "./Deploy";
import { SHOW_DEPLOYER } from "../feature-flags";
import Deployment from "./Deployment";

import "./BuildDeployments.scss";

const CLASS_NAME = "build-deployments";

type Props = {
  build: models.Build;
};

const BuildDeployments = ({ build }: Props) => {
  const [deployDialogOpen, setDeployDialogOpen] = useState<boolean>(false);

  const deployment = head(build.deployments);
  const showDeployButton = !(
    deployment &&
    (deployment.status === models.EnumDeploymentStatus.Completed ||
      deployment.status === models.EnumDeploymentStatus.Waiting)
  );

  const handleToggleDeployDialog = useCallback(() => {
    setDeployDialogOpen(!deployDialogOpen);
  }, [deployDialogOpen, setDeployDialogOpen]);

  if (!SHOW_DEPLOYER) return null;

  return (
    <div className={CLASS_NAME}>
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
        {build.deployments?.map((deployment) => (
          <Deployment
            key={deployment.id}
            deployment={deployment}
            applicationId={build.appId}
          />
        ))}
        {showDeployButton && (
          <li className={`${CLASS_NAME}__actions`}>
            This build is ready for deployment
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
          </li>
        )}
      </ul>
    </div>
  );
};

export default BuildDeployments;
