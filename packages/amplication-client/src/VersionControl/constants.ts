import * as models from "../models";
import { EnumCircleIconStyle } from "@amplication/ui/design-system";

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
  [key in models.EnumBuildStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.EnumBuildStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.EnumBuildStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Invalid]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Completed]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

export const BUILD_STATUS_TO_ICON: {
  [key in models.EnumBuildStatus]: string;
} = {
  [models.EnumBuildStatus.Completed]: "check",
  [models.EnumBuildStatus.Failed]: "close",
  [models.EnumBuildStatus.Invalid]: "circle_loader",
  [models.EnumBuildStatus.Running]: "",
};

export const STEP_STATUS_TO_ICON: {
  [key in models.EnumActionStepStatus]: string;
} = {
  [models.EnumActionStepStatus.Success]: "check",
  [models.EnumActionStepStatus.Failed]: "close",
  [models.EnumActionStepStatus.Waiting]: "circle_loader",
  [models.EnumActionStepStatus.Running]: "",
};
