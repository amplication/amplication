import { isEmpty } from "lodash";
import { useMemo } from "react";
import * as models from "../models";

const PUSH_TO_GIT_STEP_NAME = "PUSH_TO_";

const useBuildGitUrl = (build?: models.Build) => {
  const gitUrl = useMemo<string | null>(() => {
    if (!build?.action?.steps?.length) {
      return null;
    }
    const stepGithub = build?.action.steps.find((step) =>
      step.name.startsWith(PUSH_TO_GIT_STEP_NAME)
    );

    const log = stepGithub?.logs?.find(
      (log) => !isEmpty(log.meta) && !isEmpty(log.meta.githubUrl)
    );

    return log?.meta?.githubUrl || null;
  }, [build?.action]);

  const gitPrTitle = useMemo<string | null>(() => {
    if (gitUrl) {
      if (gitUrl.includes("github")) {
        const url = new URL(gitUrl);
        const prNumber = url.pathname.split("/").pop();
        return `View code (PR #${prNumber})`;
      } else if (gitUrl.includes("gitlab")) {
        const url = new URL(gitUrl);
        const prNumber = url.pathname.split("/").pop();
        return `View code (MR #${prNumber})`;
      } else if (gitUrl.includes("bitbucket")) {
        const url = new URL(gitUrl);
        const prNumber = url.pathname.split("/").pop();
        return `View code (PR #${prNumber})`;
      } else if (gitUrl.includes("azure")) {
        const url = new URL(gitUrl);
        const prNumber = url.pathname.split("/").pop();
        return `View code (PR #${prNumber})`;
      } else {
        return "View code";
      }
    }
  }, [gitUrl]);

  return { gitUrl, gitPrTitle };
};

export default useBuildGitUrl;
