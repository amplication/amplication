import {
  Button,
  CircularProgress,
  Label,
  TextField,
  Toggle,
} from "@amplication/design-system";
import { ApolloError } from "@apollo/client";
import { useCallback, useState } from "react";
import {
  EnumGitProvider,
  CreateGitRepositoryInput,
  EnumGitOrganizationType,
} from "../../../../models";
import { formatError } from "../../../../util/error";
import "./GitCreateRepo.scss";

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
  onCreateGitRepository: (data: CreateGitRepositoryInput) => void;
};

const CLASS_NAME = "git-create-repo";

export default function WizardGitCreateRepo({
  gitProvider,
  gitOrganizationName,
  repoCreated,
  gitOrganizationId,
  onCreateGitRepository,
}: Props) {
  const [createRepositoryInput, setCreateRepositoryInput] =
    useState<createRepositoryInput>({
      name: "",
      public: true,
    });

  const [repositoryName, setRepositoryName] = useState<string>(null);

  const handleChange = useCallback(
    (event) => {
      console.log(event.target.value);
      setRepositoryName(event.target.value);
    },
    [setRepositoryName]
  );

  const handleCreation = useCallback(() => {
    console.log({ repositoryName });
    onCreateGitRepository({
      gitOrganizationId: gitOrganizationId,
      gitOrganizationType: EnumGitOrganizationType.Organization,
      gitProvider: EnumGitProvider.Github,
      name: repositoryName,
      public: createRepositoryInput.public,
      resourceId: "",
    });
  }, [onCreateGitRepository]);

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
              name: createRepositoryInput.name,
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
          <td>{gitOrganizationName}/</td>
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
        type="submit"
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
