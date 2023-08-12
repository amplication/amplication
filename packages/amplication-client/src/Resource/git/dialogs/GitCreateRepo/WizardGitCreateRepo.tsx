import {
  Button,
  CircularProgress,
  HorizontalRule,
  Label,
  TextField,
  Toggle,
} from "@amplication/ui/design-system";
import { ApolloError, gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { EnumGitOrganizationType, GitGroup } from "../../../../models";
import { formatError } from "../../../../util/error";
import { GitRepositoryCreatedData } from "../GitRepos/GithubRepos";
import "./GitCreateRepo.scss";
import { GitOrganizationFromGitRepository } from "../../SyncWithGithubPage";
import { getGitRepositoryDetails } from "../../../../util/git-repository-details";
import { GitSelectMenu } from "../../select/GitSelectMenu";
import { GET_GROUPS } from "../../queries/gitProvider";

type createRepositoryInput = {
  name: string;
  isPublic: boolean;
  groupName?: string;
};
type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
  repoCreated: {
    isRepoCreateLoading: boolean;
    RepoCreatedError: ApolloError;
  };
  onCreateGitRepository: (data: GitRepositoryCreatedData) => void;
};

const CLASS_NAME = "git-create-repo";

export default function WizardGitCreateRepo({
  gitOrganization,
  repoCreated,
  onCreateGitRepository,
}: Props) {
  const [createRepositoryInput, setCreateRepositoryInput] =
    useState<createRepositoryInput>({
      name: "",
      groupName: "",
      isPublic: true,
    });
  const [gitRepositoryUrl, setGitRepositoryUrl] = useState<string>("");

  const { data: gitGroupsData } = useQuery(GET_GROUPS, {
    variables: {
      organizationId: gitOrganization.id,
    },
    skip: !gitOrganization.useGroupingForRepositories,
  });

  const gitGroups = gitGroupsData?.gitGroups?.groups;
  const [repositoryGroup, setRepositoryGroup] = useState<GitGroup>(null);
  useEffect(() => {
    if (!repositoryGroup && gitGroups && gitGroups.length > 0) {
      setRepositoryGroup(gitGroups[0]);
      setCreateRepositoryInput({
        ...createRepositoryInput,
        groupName: gitGroups[0].name,
      });
    }
  }, [gitGroups]);

  const handleSelectGroup = useCallback(
    (gitGroup) => {
      setRepositoryGroup(gitGroup);
      setCreateRepositoryInput({
        ...createRepositoryInput,
        groupName: gitGroup.name,
      });
    },
    [createRepositoryInput, setCreateRepositoryInput]
  );

  const handleNameChange = useCallback(
    (event) => {
      setCreateRepositoryInput({
        ...createRepositoryInput,
        name: event.target.value,
      });
      const gitRepositoryUrl = getGitRepositoryDetails({
        organization: gitOrganization,
        repositoryName: event.target.value,
        groupName: createRepositoryInput.groupName,
      }).repositoryUrl;
      setGitRepositoryUrl(gitRepositoryUrl);
    },
    [setCreateRepositoryInput, createRepositoryInput]
  );

  const handleCreation = useCallback(() => {
    onCreateGitRepository({
      gitOrganizationId: gitOrganization.id,
      gitOrganizationType: EnumGitOrganizationType.Organization,
      gitProvider: gitOrganization?.provider,
      name: createRepositoryInput.name,
      groupName: createRepositoryInput.groupName,
      isPublic: createRepositoryInput.isPublic,
      gitRepositoryUrl: gitRepositoryUrl,
    });
  }, [
    onCreateGitRepository,
    createRepositoryInput.name,
    createRepositoryInput.groupName,
    createRepositoryInput.isPublic,
  ]);

  return (
    <div>
      <div className={`${CLASS_NAME}__header`}>
        <h4>
          Create a new {gitOrganization?.provider} repository to sync your
          resource with
        </h4>
      </div>
      {gitOrganization.useGroupingForRepositories && (
        <>
          <div className={`${CLASS_NAME}__label`}>
            <Label text="Change workspace" />
          </div>
          <GitSelectMenu
            gitProvider={gitOrganization?.provider}
            selectedItem={repositoryGroup}
            items={gitGroups}
            onSelect={handleSelectGroup}
          />
        </>
      )}
      <br />
      <div>
        <Toggle
          name="isPublic"
          label="Public Repo"
          checked={createRepositoryInput.isPublic}
          onChange={(event, checked) => {
            setCreateRepositoryInput({
              ...createRepositoryInput,
              isPublic: checked,
            });
          }}
        />
      </div>
      <br />
      <div className={`${CLASS_NAME}__label`}>
        <Label text="Repository name" />
      </div>
      <TextField
        autoFocus
        name="name"
        autoComplete="off"
        showError={false}
        onChange={handleNameChange}
      />

      <HorizontalRule />

      <Button
        type="button"
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
