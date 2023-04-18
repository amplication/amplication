import { Snackbar } from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import classNames from "classnames";
import { AnalyticsEventNames } from "../../../../util/analytics-events.types";
import { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { EnumGitProvider, Resource } from "../../../../models";
import { formatError } from "../../../../util/error";
import { DISCONNECT_GIT_REPOSITORY } from "../../../../Workspaces/queries/resourcesQueries";
import GitRepoDetails from "../../GitRepoDetails";
import "./GithubSyncDetails.scss";

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
  const gitProvider =
    resourceWithRepository.gitRepository?.gitOrganization?.provider;
  const gitRepositoryUrlMap = {
    [EnumGitProvider.Github]: `https://github.com/${resourceWithRepository.gitRepository?.gitOrganization?.name}/${resourceWithRepository.gitRepository?.name}`,
    [EnumGitProvider.Bitbucket]: `https://bitbucket.org/${resourceWithRepository.gitRepository?.gitOrganization?.name}/${resourceWithRepository.gitRepository?.name}`,
  };
  const gitRepositoryFullName = `${resourceWithRepository.gitRepository?.gitOrganization.name}/${resourceWithRepository.gitRepository?.name}`;
  const gitRepositoryUrl = gitRepositoryUrlMap[gitProvider];
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}>
          <GitRepoDetails
            gitRepositoryFullName={gitRepositoryFullName}
            className={classNames(className, `${CLASS_NAME}__name`)}
          />
          <div>
            <a
              href={gitRepositoryUrl}
              target="github_repo"
              className={className}
            >
              {gitRepositoryUrl}
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
