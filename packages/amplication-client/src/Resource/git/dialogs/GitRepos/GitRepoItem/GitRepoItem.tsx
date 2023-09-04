import React, { useCallback } from "react";
import { RemoteGitRepository } from "../../../../../models";
import { Icon } from "@amplication/ui/design-system";
import "./GitRepoItem.scss";
import { Button } from "../../../../../Components/Button";
import { AnalyticsEventNames } from "../../../../../util/analytics-events.types";

const CLASS_NAME = "git-repo-item";

type Props = {
  repo: RemoteGitRepository;
  onSelectRepo: (repo: RemoteGitRepository) => void;
};

function GitRepoItem({ repo, onSelectRepo }: Props) {
  const handleRepoSelected = useCallback(
    (data: RemoteGitRepository) => {
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
            eventName: AnalyticsEventNames.GithubRepoSync,
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
