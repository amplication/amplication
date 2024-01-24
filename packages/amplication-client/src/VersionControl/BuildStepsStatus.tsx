import React from "react";
import { Icon, CircularProgress } from "@amplication/ui/design-system";

import * as models from "../models";

import { STEP_STATUS_TO_ICON } from "./constants";

import "./BuildStepStatus.scss";

const CLASS_NAME = "build-step-status";

type Props = {
  status: models.EnumActionStepStatus;
};

export const BuildStepsStatus = ({ status }: Props) => {
  return (
    <span className={`${CLASS_NAME} ${CLASS_NAME}--${status.toLowerCase()}`}>
      {status === models.EnumActionStepStatus.Running ? (
        <CircularProgress size={16} />
      ) : (
        <Icon icon={STEP_STATUS_TO_ICON[status]} />
      )}
    </span>
  );
};
