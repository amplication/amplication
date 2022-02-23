import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import {
  EnumSourceControlService,
  GitRepo,
  RepoCreateInput,
} from "../../../models";
import { useTracking } from "../../../util/analytics";

type Props = {
  gitOrganizationId: string;
  appId: string;
  sourceControlService: EnumSourceControlService;
  cb: (repo: GitRepo) => any;
};

export default function useGitCreate({
  gitOrganizationId,
  sourceControlService,
  appId,
  cb,
}: Props) {
  const { trackEvent } = useTracking();
  const [triggerCreation, { called, loading, error }] = useMutation(
    CREATE_REPO,
    {
      onCompleted: (data) => {
        const gitRepo: GitRepo = data.createRepoInOrg;
        cb(gitRepo);
        trackEvent({
          eventName: "createGitRepo",
        });
      },
    }
  );

  const handleCreation = useCallback(
    (data: RepoCreateInput) => {
      triggerCreation({
        variables: {
          name: data.name,
          gitOrganizationId,
          appId,
          sourceControlService,
          public: data.public,
        },
      }).catch((error) => {});
    },
    [gitOrganizationId, appId, sourceControlService, triggerCreation]
  );

  return { called, loading, error, handleCreation };
}

const CREATE_REPO = gql`
  mutation createRepoInOrg(
    $sourceControlService: EnumSourceControlService!
    $gitOrganizationId: String!
    $appId: String!
    $name: String!
    $public: Boolean!
  ) {
    createRepoInOrg(
      gitOrganizationId: $gitOrganizationId
      appId: $appId
      sourceControlService: $sourceControlService
      input: { name: $name, public: $public }
    ) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
