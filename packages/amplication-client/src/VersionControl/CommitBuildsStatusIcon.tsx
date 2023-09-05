import React, { useMemo } from "react";
import * as models from "../models";
import { CircularProgress, Icon } from "@amplication/ui/design-system";
import { BUILD_STATUS_TO_ICON } from "./constants";
import "./CommitBuildsStatusIcon.scss";

const CLASS_NAME = "build-status-icon";

type BuildStatusIconsProps = {
  commitBuildStatus: models.Maybe<models.EnumBuildStatus> | undefined;
};

export const CommitBuildsStatusIcon = ({
  commitBuildStatus,
}: BuildStatusIconsProps) => {
  const isBuildRunning = useMemo(() => {
    return commitBuildStatus === models.EnumBuildStatus.Running;
  }, [commitBuildStatus]);

  return (
    <span
      className={`${CLASS_NAME} ${CLASS_NAME}--${commitBuildStatus?.toLowerCase()}`}
    >
      {isBuildRunning && <CircularProgress size={16} />}
      {!isBuildRunning && commitBuildStatus && (
        <Icon icon={BUILD_STATUS_TO_ICON[commitBuildStatus]} />
      )}
    </span>
  );
};
