import React, { useMemo } from "react";
import * as models from "../models";
import { BuildStatusIcon } from "./BuildStatusIcon";

type Props = {
  builds: models.Maybe<models.Build[]> | undefined;
};

const CommitBuildsStatus: React.FC<Props> = ({ builds }) => {
  const buildStatus = useMemo(() => {
    const buildsInProgress = builds?.some(
      (build) => build.status === models.EnumBuildStatus.Running
    );
    const buildsFailed = builds?.some(
      (build) => build.status === models.EnumBuildStatus.Failed
    );
    const buildsCompleted = builds?.some(
      (build) => build.status === models.EnumBuildStatus.Completed
    );
    if (buildsInProgress) return models.EnumBuildStatus.Running;
    if (buildsFailed) return models.EnumBuildStatus.Failed;
    if (buildsCompleted) return models.EnumBuildStatus.Completed;
  }, [builds]);

  return <BuildStatusIcon buildStatus={buildStatus} />;
};

export default CommitBuildsStatus;
