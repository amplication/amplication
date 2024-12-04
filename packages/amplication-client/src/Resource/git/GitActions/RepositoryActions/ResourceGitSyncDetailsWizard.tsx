import classNames from "classnames";
import { AnalyticsEventNames } from "../../../../util/analytics-events.types";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import GitRepoDetails from "../../GitRepoDetails";
import { GitRepositorySelected } from "../../dialogs/GitRepos/GithubRepos";
import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";

const CLASS_NAME = "git-repo-details";

type Props = {
  repositorySelected: GitRepositorySelected;
  className?: string;
  showGitRepositoryBtn?: boolean;
  onDisconnectGitRepository: () => void;
};

function ResourceGitSyncDetailsWizard({
  repositorySelected,
  className,
  showGitRepositoryBtn = true,
  onDisconnectGitRepository,
}: Props) {
  const { repositoryName, gitRepositoryUrl } = repositorySelected;

  return (
    <FlexItem
      itemsAlign={EnumItemsAlign.Center}
      end={
        showGitRepositoryBtn && (
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            eventData={{
              eventName: AnalyticsEventNames.GithubRepositoryChange,
            }}
            onClick={onDisconnectGitRepository}
          >
            Change Repository
          </Button>
        )
      }
    >
      <FlexItem direction={EnumFlexDirection.Column}>
        <Text>
          <GitRepoDetails
            gitRepositoryFullName={repositoryName}
            className={classNames(className, `${CLASS_NAME}__name`)}
          />
        </Text>
        <Text textStyle={EnumTextStyle.Tag} underline={true}>
          <a href={gitRepositoryUrl} target="github_repo" className={className}>
            {gitRepositoryUrl}
          </a>
        </Text>
      </FlexItem>
    </FlexItem>
  );
}

export default ResourceGitSyncDetailsWizard;
