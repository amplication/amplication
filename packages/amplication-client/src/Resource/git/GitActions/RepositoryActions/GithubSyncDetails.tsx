import { Snackbar } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import classNames from "classnames";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { formatError } from "../../../../util/error";
import { ResourceWithGitRepository } from "../../SyncWithGithubPage";
import "./GithubSyncDetails.scss";

const CLASS_NAME = "github-repo-details";

type Props = {
  resourceWithRepository: ResourceWithGitRepository;
  className?: string;
  showGitRepositoryBtn?: boolean;
};

function GithubSyncDetails({
  resourceWithRepository,
  className,
  showGitRepositoryBtn = true,
}: Props) {
  const { gitRepository } = resourceWithRepository;

  const gitRepositoryFullName = `${gitRepository?.gitOrganization?.name}/${gitRepository?.name}`;

  const [
    disconnectGitRepository,
    { error: disconnectErrorUpdate },
  ] = useMutation(DISCONNECT_GIT_REPOSITORY, {
    variables: { resourceId: resourceWithRepository.id },
  });

  const handleDisconnectGitRepository = useCallback(() => {
    disconnectGitRepository({
      variables: { resourceId: resourceWithRepository.id },
    }).catch(console.error);
  }, [disconnectGitRepository, resourceWithRepository.id]);

  const errorMessage = formatError(disconnectErrorUpdate);
  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}> 
          <div className={classNames(className, `${CLASS_NAME}__name`)}>
            {gitRepositoryFullName}
          </div>
          <div>
            <a href={repoUrl} target="github_repo" className={className}>
              {repoUrl}
            </a>
          </div>
        </div>

        {showGitRepositoryBtn && (
          <div className={`${CLASS_NAME}__action`}>
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              eventData={{
                eventName: "changeGithubRepo",
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

const DISCONNECT_GIT_REPOSITORY = gql`
  mutation disconnectGitRepository($resourceId: String!) {
    disconnectResourceGitRepository(resourceId: $resourceId) {
      id
      gitRepository {
        id
      }
    }
  }
`;
