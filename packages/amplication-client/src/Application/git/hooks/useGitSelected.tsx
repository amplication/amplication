import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { App, GitRepo } from "../../../models";
import { useTracking } from "../../../util/analytics";

type Props = {
  appId: string;
  onCompleted?: () => void;
};

export default function useGitSelected({ appId, onCompleted }: Props) {
  const { trackEvent } = useTracking();

  const [enableSyncWithGithub, { error }] = useMutation<App>(
    ENABLE_SYNC_WITH_GITHUB,
    {
      onCompleted,
    }
  );

  const handleRepoSelected = useCallback(
    (data: GitRepo) => {
      enableSyncWithGithub({
        variables: {
          githubRepo: data.fullName,
          githubBranch: null,
          appId: appId,
        },
      }).catch(console.error);
      trackEvent({
        eventName: "selectGitRepo",
      });
    },
    [enableSyncWithGithub, appId, trackEvent]
  );
  return { handleRepoSelected, error };
}

export const ENABLE_SYNC_WITH_GITHUB = gql`
  mutation appEnableSyncWithGithubRepo(
    $githubRepo: String!
    $githubBranch: String
    $appId: String!
  ) {
    appEnableSyncWithGithubRepo(
      data: { githubRepo: $githubRepo, githubBranch: $githubBranch }
      where: { id: $appId }
    ) {
      id
      githubSyncEnabled
      githubRepo
      githubBranch
    }
  }
`;
