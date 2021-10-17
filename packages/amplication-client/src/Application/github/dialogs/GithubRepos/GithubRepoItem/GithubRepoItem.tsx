import { Icon } from "@rmwc/icon";
import React from "react";
import { Button } from "../../../../../Components/Button";
import useGitSelected from "../../../../../hooks/useGitSelected";
import { GitRepo } from "../../../../../models";
import "./GithubRepoItem.scss";

const CLASS_NAME = "github-repo-item";

type Props = {
  appId: string;
  repo: GitRepo;
};

function GithubRepoItem({ appId, repo }: Props) {
  const { handleRepoSelected } = useGitSelected({
    appId: appId,
  });
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__details`}>
        <span className={`${CLASS_NAME}__name`}>{repo.fullName}</span>
        {repo.private && (
          <span className={`${CLASS_NAME}__privacy`}>
            <Icon icon={{ icon: "lock", size: "xsmall" }} />
            Private
          </span>
        )}

        <div>
          <a href={repo.url} target="github_repo">
            {repo.url}
          </a>
        </div>
      </div>

      <div className={`${CLASS_NAME}__action`}>
        <Button
          eventData={{
            eventName: "selectGithubRepo",
          }}
          onClick={() => {
            handleRepoSelected(repo);
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );
}

export default GithubRepoItem;
