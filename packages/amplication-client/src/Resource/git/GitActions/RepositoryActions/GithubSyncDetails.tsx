import { Snackbar } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import classNames from "classnames";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { formatError } from "../../../../util/error";
import { GitRepositoryWithGitOrganization } from "../../SyncWithGithubPage";
import "./GithubSyncDetails.scss";

const CLASS_NAME = "github-repo-details";

type Props = {
  gitRepositoryWithOrganization: GitRepositoryWithGitOrganization;
  className?: string,
  showGitRepositoryBtn?: boolean
};

function GithubSyncDetails({ gitRepositoryWithOrganization , className, showGitRepositoryBtn = true }: Props) {
  const gitRepositoryFullName = `${gitRepositoryWithOrganization.gitOrganization.name}/${gitRepositoryWithOrganization.name}`;
  const [deleteGitRepository, { error: errorUpdate }] = useMutation(
    DELETE_GIT_REPOSITORY,
    {
      variables: { gitRepositoryId: gitRepositoryWithOrganization.id },
    }
  );

  const handleDeleteGitRepository = useCallback(() => {
    deleteGitRepository({
      variables: { gitRepositoryId: gitRepositoryWithOrganization.id },
    }).catch(console.error);
  }, [deleteGitRepository, gitRepositoryWithOrganization.id]);

  const errorMessage = formatError(errorUpdate);
  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}>
          <div className={classNames (className,`${CLASS_NAME}__name`)} >{gitRepositoryFullName}</div>
          <div>
            <a href={repoUrl} target="github_repo" className={className}>
              {repoUrl}
            </a>
          </div>
        </div>

{showGitRepositoryBtn &&  <div className={`${CLASS_NAME}__action`}>
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            eventData={{
              eventName: "changeGithubRepo",
            }}
            onClick={handleDeleteGitRepository}
          >
            Change Repository
          </Button>
        </div>}
  
      </div>

      <Snackbar open={Boolean(errorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GithubSyncDetails;

const DELETE_GIT_REPOSITORY = gql`
  mutation deleteGitRepository($gitRepositoryId: String!) {
    deleteGitRepository(gitRepositoryId: $gitRepositoryId) {
      id
      gitRepository {
        id
      }
    }
  }
`;
