import classNames from "classnames";
import { AnalyticsEventNames } from "../../../../util/analytics-events.types";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import GitRepoDetails from "../../GitRepoDetails";
import "./GithubSyncDetails.scss";
import { GitRepositorySelected } from "../../dialogs/GitRepos/GithubRepos";

const CLASS_NAME = "git-repo-details";

type Props = {
  repositorySelected: GitRepositorySelected;
  className?: string;
  showGitRepositoryBtn?: boolean;
  onDisconnectGitRepository: () => void;
};

function WizardGithubSyncDetails({
  repositorySelected,
  className,
  showGitRepositoryBtn = true,
  onDisconnectGitRepository,
}: Props) {
  const { repositoryName, gitRepositoryUrl } = repositorySelected;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}>
          <GitRepoDetails
            gitRepositoryFullName={repositoryName}
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
              onClick={onDisconnectGitRepository}
            >
              Change Repository
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WizardGithubSyncDetails;
