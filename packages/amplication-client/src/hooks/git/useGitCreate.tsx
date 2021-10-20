import { gql, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import {
  EnumSourceControlService,
  GitRepo,
  RepoCreateInput,
} from "../../models";
import { formatError } from "../../util/error";

type Props = {
  appId: string;
  sourceControlService: EnumSourceControlService;
  cb: (repo: GitRepo) => any;
};

export default function useGitCreate({
  appId,
  sourceControlService,
  cb,
}: Props) {
  const [error, setError] = useState("");
  const [triggerCreation, { called, loading }] = useMutation(CREATE_REPO);

  const handleCreation = useCallback(
    (data: RepoCreateInput) => {
      triggerCreation({
        variables: {
          name: data.name,
          appId,
          sourceControlService,
          public: data.public,
        },
      })
        .then((value) => {
          const data: GitRepo = value.data.createRepoInOrg;
          cb(data);
        })
        .catch((error: Error) => {
          setError(formatError(error) || "Unknown error");
        });
      // trackEvent({
      //   eventName: "updateAppSettings",
      // }); //TODO what is that
    },
    [appId, cb, sourceControlService, triggerCreation]
  );

  return { called, loading, error, handleCreation };
}

const CREATE_REPO = gql`
  mutation createRepoInOrg(
    $sourceControlService: EnumSourceControlService!
    $appId: String!
    $name: String!
    $public: Boolean!
  ) {
    createRepoInOrg(
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
