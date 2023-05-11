import { Snackbar } from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import classNames from "classnames";
import { AnalyticsEventNames } from "../../../../util/analytics-events.types";
import { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { Resource } from "../../../../models";
import { formatError } from "../../../../util/error";
import { DISCONNECT_GIT_REPOSITORY } from "../../../../Workspaces/queries/resourcesQueries";
import GitRepoDetails from "../../GitRepoDetails";
import "./GithubSyncDetails.scss";
import { getGitRepositoryDetails } from "../../../../util/git-repository-details";

const CLASS_NAME = "git-repo-details";

type Props = {
  resourceWithRepository: Resource;
  className?: string;
  showGitRepositoryBtn?: boolean;
};

function GithubSyncDetails({
  resourceWithRepository,
  className,
  showGitRepositoryBtn = true,
}: Props) {
  const [disconnectGitRepository, { error: disconnectErrorUpdate }] =
    useMutation(DISCONNECT_GIT_REPOSITORY, {
      variables: { resourceId: resourceWithRepository.id },
    });

  const handleDisconnectGitRepository = useCallback(() => {
    disconnectGitRepository({
      variables: { resourceId: resourceWithRepository.id },
    }).catch(console.error);
  }, [disconnectGitRepository, resourceWithRepository.id]);
  const errorMessage = formatError(disconnectErrorUpdate);
  const gitRepositoryDetails = getGitRepositoryDetails({
    organization: resourceWithRepository.gitRepository?.gitOrganization,
    repositoryName: resourceWithRepository.gitRepository?.name,
    groupName: resourceWithRepository?.gitRepository?.groupName,
  });
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}>
          <GitRepoDetails
            gitRepositoryFullName={gitRepositoryDetails.repositoryFullName}
            className={classNames(className, `${CLASS_NAME}__name`)}
          />
          <div>
            <a
              href={gitRepositoryDetails.repositoryUrl}
              target="github_repo"
              className={className}
            >
              {gitRepositoryDetails.repositoryUrl}
            </a>
          </div>
        </div>

        {showGitRepositoryBtn && (
          <div className={`${CLASS_NAME}__action`}>
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              eventData={{
                eventName: AnalyticsEventNames.GithubRepositoryChange,
              }}
              onClick={handleDisconnectGitRepository}
            >
              Change Repository
            </Button>
          </div>
        )}
      </div>

      <Snackbar open={Boolean(disconnectErrorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GithubSyncDetails;
