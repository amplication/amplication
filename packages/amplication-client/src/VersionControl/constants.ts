import * as models from "../models";
import { EnumCircleIconStyle } from "@amplication/design-system";

export const STEP_STATUS_TO_STYLE: {
  [key in models.EnumActionStepStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.EnumActionStepStatus.Waiting]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.EnumActionStepStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.EnumActionStepStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumActionStepStatus.Success]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

export const BUILD_STATUS_TO_STYLE: {
  [key in models.BuildStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.BuildStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.BuildStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.BuildStatus.Invalid]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.BuildStatus.Completed]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

export const STEP_STATUS_TO_ICON: {
  [key in models.EnumActionStepStatus]: string;
} = {
  [models.EnumActionStepStatus.Success]: "check",
  [models.EnumActionStepStatus.Failed]: "close",
  [models.EnumActionStepStatus.Waiting]: "circle_loader",
  [models.EnumActionStepStatus.Running]: "",
};
