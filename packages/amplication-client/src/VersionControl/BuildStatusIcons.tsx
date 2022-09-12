import React, { useMemo } from "react";
import * as models from "../models";
import { Icon, Tooltip } from "@amplication/design-system";
import { GENERATE_STEP_NAME, EMPTY_STEP } from "./BuildSteps";
import { BuildStepsStatus } from "./BuildStepsStatus";
import "./BuildStatusIcons.scss";
import useBuildWatchStatus from "./useBuildWatchStatus";

const CLASS_NAME = "build-status-icons";
const TOOLTIP_DIRECTION = "nw";

type BuildStatusIconsProps = {
  build: models.Build;
  showIcon?: boolean;
};

const BuildStatusIconWithBuild: React.FC<BuildStatusIconsProps> = ({
  build,
  showIcon,
}) => {
  const { data } = useBuildWatchStatus(build);

  const stepGenerateCode = useMemo(() => {
    if (!data.build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find(
        (step) => step.name === GENERATE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [data.build.action]);

  return (
    <Tooltip
      direction={TOOLTIP_DIRECTION}
      wrap
      aria-label="Generate Code"
      className={`${CLASS_NAME}__status`}
    >
      <BuildStepsStatus status={stepGenerateCode.status} />
      {showIcon && <Icon icon="code1" />}
    </Tooltip>
  );
};
export const BuildStatusIcons = ({
  build,
  showIcon = true,
}: BuildStatusIconsProps) => {
  if (!build?.id) {
    return <div />;
  }
  return <BuildStatusIconWithBuild build={build} showIcon={showIcon} />;
};
