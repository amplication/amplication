import React, { useCallback } from "react";
import { GitRepo } from "../../../../../models";
import { Icon } from "@amplication/design-system";
import "./GitRepoItem.scss";
import { Button } from "../../../../../Components/Button";

const CLASS_NAME = "git-repo-item";

type Props = {
  repo: GitRepo;
  onSelectRepo: (repo: GitRepo) => void;
};

function GitRepoItem({ repo, onSelectRepo }: Props) {
  const handleRepoSelected = useCallback(
    (data: GitRepo) => {
      onSelectRepo(data);
    },
    [onSelectRepo]
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__details`}>
        <span className={`${CLASS_NAME}__name`}>{repo.fullName}</span>
        {repo.private && (
          <span className={`${CLASS_NAME}__privacy`}>
            <Icon icon="lock" size="xsmall" />
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

export default GitRepoItem;
