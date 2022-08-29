import React, { useCallback, useMemo } from "react";

import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import { downloadArchive } from "./BuildSteps";

import useBuildWatchStatus from "./useBuildWatchStatus";
import { HelpPopover } from "../Components/HelpPopover";
import { GET_RESOURCE } from "../Resource/ResourceHome";
import useLocalStorage from "react-use-localstorage";

import "./BuildSummary.scss";
import { CircularProgress, Icon, Tooltip, Button, EnumButtonStyle } from "@amplication/design-system";

const CLASS_NAME = "build-summary";

export const EMPTY_STEP: models.ActionStep = {
  id: "",
  createdAt: null,
  name: "",
  status: models.EnumActionStepStatus.Waiting,
  message: "",
};

export const GENERATE_STEP_NAME = "GENERATE_RESOURCE";
export const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";
export const DEPLOY_STEP_NAME = "DEPLOY_RESOURCE";
export const PUSH_TO_GITHUB_STEP_NAME = "PUSH_TO_GITHUB";

type Props = {
  build: models.Build;
  generating: boolean;
  onError: (error: Error) => void;
};

const LOCAL_STORAGE_KEY_SHOW_GITHUB_HELP = "ShowGitHubContextHelp";

const BuildSummary = ({ generating, build, onError }: Props) => {
  const { data } = useBuildWatchStatus(build);

  const [showGitHelp, setShowGitHubHelp] = useLocalStorage(
    LOCAL_STORAGE_KEY_SHOW_GITHUB_HELP,
    "true"
  );

  const { data: resourceData } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE, {
    variables: {
      id: build.resourceId,
    },
  });

  const handleDownloadClick = useCallback(() => {
    downloadArchive(data.build.archiveURI).catch(onError);
  }, [data.build.archiveURI, onError]);

  const handleDismissHelpGitHub = useCallback(() => {
    setShowGitHubHelp("false");
  }, [setShowGitHubHelp]);

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
        ) : !resourceData?.resource.githubSyncEnabled ? ( //resource is not connected to github
          <HelpPopover
            onDismiss={handleDismissHelpGitHub}
            content={
              <div>
                Enable sync with GitHub to automatically push the generated code
                of your resource and create a Pull Request in your GitHub
                repository every time you commit your changes.
              </div>
            }
            open={showGitHelp === "false" ? false : true}
            placement="top-start"
          >
            <Link
              to={`/${build.resourceId}/code-view`}
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
          //resource was connected after this build was created
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

      {generating && (
        <div className={`${CLASS_NAME}__generating`}>
          <CircularProgress />
          Generating new build...
        </div>
      )}
    </div>
  );
};

export default BuildSummary;
