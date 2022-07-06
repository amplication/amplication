import React, { useMemo } from "react";
import * as models from "../models";
import { Icon, Tooltip } from "@amplication/design-system";
import { GENERATE_STEP_NAME, EMPTY_STEP } from "./BuildSteps";
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

  return (
    <Tooltip
      direction={TOOLTIP_DIRECTION}
      wrap
      aria-label="Generate Code"
      className={`${CLASS_NAME}__status`}
    >
      <BuildStepsStatus status={stepGenerateCode.status} />
      <Icon icon="code1" />
    </Tooltip>
  );
};
