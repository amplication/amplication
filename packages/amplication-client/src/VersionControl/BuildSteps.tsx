import React, { useMemo } from "react";
import { isEmpty } from "lodash";

import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";

import useBuildWatchStatus from "./useBuildWatchStatus";
import { Panel, EnumPanelStyle, Icon } from "@amplication/design-system";

import { BuildStepsStatus } from "./BuildStepsStatus";

import "./BuildSteps.scss";

const CLASS_NAME = "build-steps";

export const EMPTY_STEP: models.ActionStep = {
  id: "",
  createdAt: null,
  name: "",
  status: models.EnumActionStepStatus.Waiting,
  message: "",
};

export const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
export const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";
export const DEPLOY_STEP_NAME = "DEPLOY_RESOURCE";
export const PUSH_TO_GITHUB_STEP_NAME = "PUSH_TO_GITHUB";

type Props = {
  build: models.Build;
};

const BuildSteps = ({ build }: Props) => {
  const { data } = useBuildWatchStatus(build);

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

  const stepGithub = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return null;
    }
    return (
      data.build.action.steps.find(
        (step) => step.name === PUSH_TO_GITHUB_STEP_NAME
      ) || null
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
    <div>
      <Panel
        className={`${CLASS_NAME}__step`}
        panelStyle={EnumPanelStyle.Bordered}
      >
        <Icon icon="code1" />
        <span>Generate Code</span>
        <BuildStepsStatus status={stepGenerateCode.status} />
        <span className="spacer" />
      </Panel>
      {stepGithub && (
        <Panel
          className={`${CLASS_NAME}__step`}
          panelStyle={EnumPanelStyle.Bordered}
        >
          <Icon icon="github" />
          <span>Push Changes to GitHub</span>
          <BuildStepsStatus status={stepGithub.status} />
          <span className="spacer" />
          {githubUrl && (
            <a href={githubUrl} target="github">
              <Button
                buttonStyle={EnumButtonStyle.Text}
                icon="external_link"
                disabled={
                  stepGenerateCode.status !==
                  models.EnumActionStepStatus.Success
                }
                eventData={{
                  eventName: "openGithubPullRequest",
                }}
              />
            </a>
          )}
        </Panel>
      )}
    </div>
  );
};

export default BuildSteps;
