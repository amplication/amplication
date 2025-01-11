import { EnumItemsAlign, FlexItem } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { AnalyticsEventNames } from "../../../../util/analytics-events.types";
import { GitRepositorySelected } from "../../dialogs/GitRepos/GithubRepos";
import ResourceGitSyncDetailsContent from "./ResourceGitSyncDetailsContent";

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
  const { repositoryName, gitRepositoryUrl, gitProvider } = repositorySelected;

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
      <ResourceGitSyncDetailsContent
        gitProvider={gitProvider}
        repositoryFullName={repositoryName}
        repositoryUrl={gitRepositoryUrl}
      />
    </FlexItem>
  );
}

export default ResourceGitSyncDetailsWizard;
