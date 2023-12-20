import { useMemo } from "react";
import * as models from "../../models";

export const useCommitStatus = (commit: models.Commit | null) => {
  const commitBuilds = commit?.builds;
  const commitStatus = useMemo(() => {
    if (!commitBuilds?.length) return;
    const buildsInProgress = commitBuilds.some(
      (build) => build.status === models.EnumBuildStatus.Running
    );
    const buildsFailed = commitBuilds.some(
      (build) => build.status === models.EnumBuildStatus.Failed
    );
    const buildsCompleted = commitBuilds.some(
      (build) => build.status === models.EnumBuildStatus.Completed
    );
    if (buildsInProgress) return models.EnumBuildStatus.Running;
    if (buildsFailed) return models.EnumBuildStatus.Failed;
    if (buildsCompleted) return models.EnumBuildStatus.Completed;
  }, [commitBuilds]);

  return { commitStatus };
};
