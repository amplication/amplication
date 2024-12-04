import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { DISCONNECT_GIT_REPOSITORY } from "../../../../Workspaces/queries/resourcesQueries";
import { Resource } from "../../../../models";
import { AnalyticsEventNames } from "../../../../util/analytics-events.types";
import { formatError } from "../../../../util/error";
import { getGitRepositoryDetails } from "../../../../util/git-repository-details";
import GitRepoDetails from "../../GitRepoDetails";

type Props = {
  resourceWithRepository: Resource;
  className?: string;
  showGitRepositoryBtn?: boolean;
};

function ResourceGitSyncDetails({
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
    <>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        end={
          showGitRepositoryBtn && (
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              eventData={{
                eventName: AnalyticsEventNames.GithubRepositoryChange,
              }}
              onClick={handleDisconnectGitRepository}
            >
              Change Repository
            </Button>
          )
        }
      >
        <FlexItem direction={EnumFlexDirection.Column}>
          <Text>
            <GitRepoDetails
              gitRepositoryFullName={gitRepositoryDetails.repositoryFullName}
            />
          </Text>
          <Text textStyle={EnumTextStyle.Tag} underline={true}>
            <a href={gitRepositoryDetails.repositoryUrl} target="github_repo">
              {gitRepositoryDetails.repositoryUrl}
            </a>
          </Text>
        </FlexItem>
      </FlexItem>

      <Snackbar open={Boolean(disconnectErrorUpdate)} message={errorMessage} />
    </>
  );
}

export default ResourceGitSyncDetails;
