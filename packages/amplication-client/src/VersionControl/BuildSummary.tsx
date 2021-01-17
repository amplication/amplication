import React, { useCallback, useMemo } from "react";

import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { Icon } from "@rmwc/icon";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { downloadArchive } from "./BuildSteps";

import useBuildWatchStatus from "./useBuildWatchStatus";
import { BuildStepsStatus } from "./BuildStepsStatus";
import { useTracking } from "../util/analytics";
import { GET_APPLICATION } from "../Application/ApplicationHome";

import "./BuildSummary.scss";

const CLASS_NAME = "build-summary";

export const EMPTY_STEP: models.ActionStep = {
  id: "",
  createdAt: null,
  name: "",
  status: models.EnumActionStepStatus.Waiting,
  message: "",
};

export const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
export const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";
export const DEPLOY_STEP_NAME = "DEPLOY_APP";
export const PUSH_TO_GITHUB_STEP_NAME = "PUSH_TO_GITHUB";

type Props = {
  build: models.Build;
  onError: (error: Error) => void;
};

const BuildSummary = ({ build, onError }: Props) => {
  const { data } = useBuildWatchStatus(build);
  const { trackEvent } = useTracking();

  const { data: appData } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: build.appId,
    },
  });

  const handleDownloadClick = useCallback(() => {
    downloadArchive(data.build.archiveURI).catch(onError);
  }, [data.build.archiveURI, onError]);

  const handleViewBuildClick = useCallback(() => {
    trackEvent({
      eventName: "BuildSandboxViewDetailsClick",
    });
  }, [trackEvent]);

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

  const stepDeploy = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find((step) => step.name === DEPLOY_STEP_NAME) ||
      null
    );
  }, [data.build.action]);

  const githubUrl = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return null;
    }
    const stepGithub = data.build.action.steps.find(
      (step) => step.name === PUSH_TO_GITHUB_STEP_NAME
    );

    const log = stepGithub?.logs?.find(
      (log) => !isEmpty(log.meta) && !isEmpty(log.meta.githubUrl)
    );

    return log?.meta?.githubUrl || null;
  }, [data.build.action]);

  const deployment =
    data.build.deployments &&
    data.build.deployments.length &&
    data.build.deployments[0];

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__download`}>
        {githubUrl ? ( //code was synced to github
          <a
            href={githubUrl}
            target="github"
            className={`${CLASS_NAME}__open-github`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              eventData={{
                eventName: "openGithubPullRequest",
              }}
            >
              Open GitHub
            </Button>
          </a>
        ) : !appData?.app.githubSyncEnabled ? ( //app is not connected to github
          <Link
            to={`/${build.appId}/settings`}
            className={`${CLASS_NAME}__open-github`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              eventData={{
                eventName: "buildConnectToGithub",
              }}
            >
              Push Code to GitHub
            </Button>
          </Link>
        ) : (
          //app was connected after this build was created
          <div className={`${CLASS_NAME}__message`}>
            <Icon icon={{ size: "xsmall", icon: "info_circle" }} />
            <span>
              You are now connected to GitHub. Future builds will create a Pull
              Request in your repo.
            </span>
          </div>
        )}
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          disabled={
            stepGenerateCode.status !== models.EnumActionStepStatus.Success
          }
          onClick={handleDownloadClick}
          eventData={{
            eventName: "downloadBuild",
            versionNumber: data.build.version,
          }}
        >
          Download Code
        </Button>
      </div>

      {stepBuildDocker.status === models.EnumActionStepStatus.Running ||
      stepDeploy?.status === models.EnumActionStepStatus.Running ? (
        <div className={`${CLASS_NAME}__sandbox`}>
          <BuildStepsStatus status={models.EnumActionStepStatus.Running} />
          <span>
            We prepare your sandbox environment. It may take around 5 minutes,
            keep working and come back later.{" "}
            <Link
              to={`/${build.appId}/builds/${build.id}`}
              onClick={handleViewBuildClick}
            >
              {" "}
              View Details
            </Link>
          </span>
        </div>
      ) : deployment &&
        stepDeploy?.status === models.EnumActionStepStatus.Success ? (
        <a href={deployment.environment.address} target="app">
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            eventData={{
              eventName: "openPreviewApp",
              versionNumber: data.build.version,
            }}
          >
            Open Sandbox environment
          </Button>
        </a>
      ) : (
        <div className={`${CLASS_NAME}__sandbox`}>
          {stepDeploy ? (
            <>
              <BuildStepsStatus status={models.EnumActionStepStatus.Failed} />
              <span>
                Deployment to sandbox environment failed.{" "}
                <Link
                  to={`/${build.appId}/builds/${build.id}`}
                  onClick={handleViewBuildClick}
                >
                  {" "}
                  View Details
                </Link>
              </span>
            </>
          ) : (
            <>
              <Icon icon={{ size: "xsmall", icon: "info_circle" }} />

              <span>Commit changes to start deployment to sandbox. </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildSummary;
