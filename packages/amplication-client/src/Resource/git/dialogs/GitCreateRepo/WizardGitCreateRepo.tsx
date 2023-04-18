import {
  Button,
  CircularProgress,
  Label,
  TextField,
  Toggle,
} from "@amplication/ui/design-system";
import { ApolloError } from "@apollo/client";
import { useCallback, useContext, useState } from "react";
import { EnumGitProvider, EnumGitOrganizationType } from "../../../../models";
import { formatError } from "../../../../util/error";
import { GitRepositoryCreatedData } from "../GitRepos/GithubRepos";
import "./GitCreateRepo.scss";
import { AppContext } from "../../../../context/appContext";

type createRepositoryInput = {
  name: string;
  public: boolean;
};
type Props = {
  gitProvider: EnumGitProvider;
  gitOrganizationName: string;
  gitOrganizationId: string;
  repoCreated: {
    isRepoCreateLoading: boolean;
    RepoCreatedError: ApolloError;
  };
  onCreateGitRepository: (data: GitRepositoryCreatedData) => void;
};

const CLASS_NAME = "git-create-repo";

export default function WizardGitCreateRepo({
  gitProvider,
  gitOrganizationName,
  repoCreated,
  gitOrganizationId,
  onCreateGitRepository,
}: Props) {
  const { gitRepositoryUrl } = useContext(AppContext);
  const [createRepositoryInput, setCreateRepositoryInput] =
    useState<createRepositoryInput>({
      name: "",
      public: true,
    });

  const handleChange = useCallback(
    (event) => {
      setCreateRepositoryInput({
        ...createRepositoryInput,
        name: event.target.value,
      });
    },
    [setCreateRepositoryInput, createRepositoryInput]
  );

  const handleCreation = useCallback(() => {
    onCreateGitRepository({
      gitOrganizationId: gitOrganizationId,
      gitOrganizationType: EnumGitOrganizationType.Organization,
      gitProvider,
      name: createRepositoryInput.name,
      public: createRepositoryInput.public,
      gitRepositoryUrl: gitRepositoryUrl,
    });
  }, [
    onCreateGitRepository,
    createRepositoryInput.name,
    createRepositoryInput.public,
  ]);

  return (
    <div>
      <div className={`${CLASS_NAME}__header`}>
        <h4>
          Create a new {gitProvider} repository to sync your resource with
        </h4>
        <br />
      </div>
      <div>
        <Toggle
          name="public"
          label={createRepositoryInput.public ? "Public Repo" : "Private Repo"}
          checked={createRepositoryInput.public}
          onChange={(event, checked) => {
            setCreateRepositoryInput({
              ...createRepositoryInput,
              public: checked,
            });
          }}
        />
      </div>
      <table className={`${CLASS_NAME}__table`}>
        <tr>
          <th>Owner</th>
          <th>Repository name</th>
        </tr>
        <tr>
          <td style={{ color: "#FFFFFF" }}>{gitOrganizationName}/</td>
          <td>
            <TextField
              autoFocus
              name="name"
              autoComplete="off"
              showError={false}
              onChange={handleChange}
            />
          </td>
        </tr>
      </table>
      <Button
        className={`${CLASS_NAME}__button`}
        disabled={repoCreated.isRepoCreateLoading}
        onClick={handleCreation}
      >
        {repoCreated.isRepoCreateLoading ? (
          <CircularProgress
            className={`${CLASS_NAME}__progress`}
            centerToParent
          />
        ) : (
          "Create new repository"
        )}
      </Button>
      <Label
        text={formatError(repoCreated.RepoCreatedError) || ""}
        type="error"
      />
    </div>
  );
}
