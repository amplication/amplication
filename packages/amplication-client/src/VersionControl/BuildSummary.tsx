import React, { useCallback, useMemo } from "react";

import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { Icon, Tooltip, CircularProgress } from "@amplication/design-system";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { downloadArchive } from "./BuildSteps";

import useBuildWatchStatus from "./useBuildWatchStatus";
import { BuildStepsStatus } from "./BuildStepsStatus";
import { HelpPopover } from "../Components/HelpPopover";
import { GET_APPLICATION } from "../Application/ApplicationHome";
import useLocalStorage from "react-use-localstorage";

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
  generating: boolean;
  onError: (error: Error) => void;
};

const LOCAL_STORAGE_KEY_SHOW_GITHUB_HELP = "ShowGitHubContextHelp";
const LOCAL_STORAGE_KEY_SHOW_SANDBOX_HELP = "ShowGSandboxContextHelp";

const BuildSummary = ({ generating, build, onError }: Props) => {
  const { data } = useBuildWatchStatus(build);

  const [showGitHelp, setShowGitHubHelp] = useLocalStorage(
    LOCAL_STORAGE_KEY_SHOW_GITHUB_HELP,
    "true"
  );

  const [showSandboxHelp, setShowSandboxHelp] = useLocalStorage(
    LOCAL_STORAGE_KEY_SHOW_SANDBOX_HELP,
    "false"
  );

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

  const handleDismissHelpGitHub = useCallback(() => {
    setShowGitHubHelp("false");
    setShowSandboxHelp("true");
  }, [setShowGitHubHelp, setShowSandboxHelp]);

  const handleDismissHelpSandbox = useCallback(() => {
    setShowSandboxHelp("false");
  }, [setShowSandboxHelp]);

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
              icon="github"
              disabled={generating}
              eventData={{
                eventName: "openGithubPullRequest",
              }}
            >
              Open GitHub
            </Button>
          </a>
        ) : !appData?.app.githubSyncEnabled ? ( //app is not connected to github
          <HelpPopover
            onDismiss={handleDismissHelpGitHub}
            content={
              <div>
                Enable sync with GitHub to automatically push the generated code
                of your application and create a Pull Request in your GitHub
                repository every time you commit your changes.
              </div>
            }
            open={showGitHelp === "false" ? false : true}
            placement="top-start"
          >
            <Link
              to={`/${build.appId}/code-view`}
              className={`${CLASS_NAME}__view-code`}
            >
              <Button
                buttonStyle={EnumButtonStyle.Secondary}
                icon="code"
                disabled={generating}
                eventData={{
                  eventName: "FooterViewCode",
                }}
              >
                View Code
              </Button>
            </Link>
          </HelpPopover>
        ) : (
          //app was connected after this build was created
          <div className={`${CLASS_NAME}__message`}>
            <Icon size="small" icon="info_circle" />
            <span>
              You are now connected to GitHub. Future builds will create a Pull
              Request in your repo.
            </span>
          </div>
        )}
        <Tooltip aria-label={"Download Code"} direction="nw">
          <Button
            buttonStyle={EnumButtonStyle.Text}
            disabled={
              stepGenerateCode.status !== models.EnumActionStepStatus.Success ||
              generating
            }
            onClick={handleDownloadClick}
            icon="download1"
            iconSize="large"
            eventData={{
              eventName: "downloadBuild",
              versionNumber: data.build.version,
            }}
          />
        </Tooltip>
      </div>

      {generating ? (
        <div className={`${CLASS_NAME}__generating`}>
          <CircularProgress />
          Generating new build...
        </div>
      ) : (
        <HelpPopover
          onDismiss={handleDismissHelpSandbox}
          content={
            <div>
              All your committed changes are continuously deployed to a sandbox
              environment on the Amplication cloud so you can easily access your
              application for testing and development purposes.
            </div>
          }
          open={showSandboxHelp === "false" ? false : true}
          placement="top-start"
        >
          {stepBuildDocker.status === models.EnumActionStepStatus.Running ||
          stepDeploy?.status === models.EnumActionStepStatus.Running ? (
            // <Link to={`/${build.appId}/builds/${build.id}`}>
            //   <Button
            //     buttonStyle={EnumButtonStyle.Clear}
            //     eventData={{
            //       eventName: "BuildSandboxViewDetailsClick",
            //     }}
            //   >
            //     <BuildStepsStatus
            //       status={models.EnumActionStepStatus.Running}
            //     />
            //     Preparing sandbox environment...
            //   </Button>
            // </Link>
            <div />
          ) : deployment &&
            stepDeploy?.status === models.EnumActionStepStatus.Success ? (
            <a href={deployment.environment.address} target="app">
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                icon="link_2"
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
                <Link to={`/${build.appId}/builds/${build.id}`}>
                  <Button
                    buttonStyle={EnumButtonStyle.Clear}
                    eventData={{
                      eventName: "buildFailedViewDetails",
                    }}
                  >
                    <BuildStepsStatus
                      status={models.EnumActionStepStatus.Failed}
                    />
                    Deployment to sandbox failed
                  </Button>
                </Link>
              ) : (
                <>
                  <Icon size="small" icon="info_circle" />

                  <span>Commit changes to start deployment to sandbox. </span>
                </>
              )}
            </div>
          )}
        </HelpPopover>
      )}
    </div>
  );
};

export default BuildSummary;
