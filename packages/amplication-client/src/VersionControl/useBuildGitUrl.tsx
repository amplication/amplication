import { isEmpty } from "lodash";
import { useMemo } from "react";
import * as models from "../models";

const PUSH_TO_GIT_STEP_NAME = "PUSH_TO_";

const useBuildGitUrl = (build?: models.Build) => {
  const metadata = useMemo<{
    githubUrl: string | null;
    diffStat: string;
  } | null>(() => {
    if (!build?.action?.steps?.length) {
      return null;
    }
    const stepGithub = build?.action.steps.find((step) =>
      step.name.startsWith(PUSH_TO_GIT_STEP_NAME)
    );

    const log = stepGithub?.logs?.find(
      (log) => !isEmpty(log.meta) && !isEmpty(log.meta.githubUrl)
    );

    return log?.meta;
  }, [build?.action]);

  return {
    gitUrl: metadata?.githubUrl || null,
    diffStat: metadata?.diffStat || "",
  };
};

export default useBuildGitUrl;
