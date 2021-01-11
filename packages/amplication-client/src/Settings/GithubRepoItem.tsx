import React, { useCallback } from "react";
import * as models from "../models";
import { Button } from "@amplication/design-system";
import "./GithubRepoItem.scss";

const CLASS_NAME = "github-repo-item";

type Props = {
  repo: models.GithubRepo;
  onSelectRepo: (repo: models.GithubRepo) => void;
};

function GithubRepoItem({ repo, onSelectRepo }: Props) {
  const handleRepoSelected = useCallback(
    (data: models.GithubRepo) => {
      onSelectRepo(data);
    },
    [onSelectRepo]
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__details`}>
        <span className={`${CLASS_NAME}__name`}>{repo.fullName}</span>
        {repo.private && (
          <span className={`${CLASS_NAME}__privacy`}>Private</span>
        )}

        <div>
          <a href={repo.url} target="github_repo">
            {repo.url}
          </a>
        </div>
      </div>

      <div className={`${CLASS_NAME}__action`}>
        <Button
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
