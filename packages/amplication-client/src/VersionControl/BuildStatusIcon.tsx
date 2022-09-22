import React, { useMemo } from "react";
import * as models from "../models";
import { CircularProgress, Icon } from "@amplication/design-system";
import { BUILD_STATUS_TO_ICON } from "./constants";
import "./BuildStatusIcon.scss";

const CLASS_NAME = "build-status-icon";

type BuildStatusIconsProps = {
  buildStatus: models.Maybe<models.EnumBuildStatus> | undefined;
};

export const BuildStatusIcon = ({ buildStatus }: BuildStatusIconsProps) => {
  const isBuildRunning = useMemo(() => {
    return buildStatus === models.EnumBuildStatus.Running;
  }, [buildStatus]);

  return (
    <span
      className={`${CLASS_NAME} ${CLASS_NAME}--${buildStatus?.toLowerCase()}`}
    >
      {isBuildRunning && <CircularProgress size={16} />}
      {!isBuildRunning && buildStatus && (
        <Icon icon={BUILD_STATUS_TO_ICON[buildStatus]} />
      )}
    </span>
  );
};
