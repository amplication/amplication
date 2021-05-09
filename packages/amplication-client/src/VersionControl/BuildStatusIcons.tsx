import React, { useMemo } from "react";
import * as models from "../models";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";
import {
  GENERATE_STEP_NAME,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  EMPTY_STEP,
  DEPLOY_STEP_NAME,
} from "./BuildSteps";
import { BuildStepsStatus } from "./BuildStepsStatus";
import "./BuildStatusIcons.scss";

const CLASS_NAME = "build-status-icons";
const TOOLTIP_DIRECTION = "nw";

type BuildStatusIconsProps = {
  build: models.Build;
};
export const BuildStatusIcons = ({ build }: BuildStatusIconsProps) => {
  const stepGenerateCode = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === GENERATE_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build]);

  const stepBuildDocker = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [build]);

  const stepDeploy = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === DEPLOY_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build]);

  return (
    <>
      <Tooltip
        direction={TOOLTIP_DIRECTION}
        wrap
        aria-label="Generate Code"
        className={`${CLASS_NAME}__status`}
      >
        <BuildStepsStatus status={stepGenerateCode.status} />
        <Icon icon="code1" />
      </Tooltip>
      <Tooltip
        direction={TOOLTIP_DIRECTION}
        wrap
        aria-label="Build Container"
        className={`${CLASS_NAME}__status`}
      >
        <BuildStepsStatus status={stepBuildDocker.status} />
        <Icon icon="docker" />
      </Tooltip>
      <Tooltip
        direction={TOOLTIP_DIRECTION}
        wrap
        aria-label="Publish App to Sandbox"
        className={`${CLASS_NAME}__status`}
      >
        <BuildStepsStatus status={stepDeploy?.status} />
        <Icon icon="publish" />
      </Tooltip>
    </>
  );
};
