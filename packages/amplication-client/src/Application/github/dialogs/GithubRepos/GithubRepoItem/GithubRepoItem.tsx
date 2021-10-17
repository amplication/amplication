import React, { useCallback } from "react";
import * as models from "../../../../../models";
import { Icon } from "@rmwc/icon";
import "./GithubRepoItem.scss";
import { Button } from "../../../../../Components/Button";

const CLASS_NAME = "github-repo-item";

type Props = {
  repo: models.GitRepo;
  onSelectRepo: (repo: models.GitRepo) => void;
};

function GithubRepoItem({ repo, onSelectRepo }: Props) {
  const handleRepoSelected = useCallback(
    (data: models.GitRepo) => {
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
