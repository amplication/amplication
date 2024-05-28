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

  const commitLastError = useMemo(() => {
    if (!commitBuilds?.length) return;
    if (commitStatus !== models.EnumBuildStatus.Failed) return;

    const failedBuild = commitBuilds.find(
      (build) => build.status === models.EnumBuildStatus.Failed
    );

    const failedStep = failedBuild?.action.steps.find(
      (step) => step.status === models.EnumActionStepStatus.Failed
    );

    const failedLog = failedStep?.logs.find(
      (log) => log.level === models.EnumActionLogLevel.Error
    );

    return failedLog?.message;
  }, [commitBuilds, commitStatus]);

  return { commitStatus, commitLastError };
};
