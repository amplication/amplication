import {
  Button,
  CircularProgress,
  HorizontalRule,
  Label,
  TextField,
  ToggleField,
} from "@amplication/ui/design-system";
import { ApolloError, gql, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { EnumGitProvider, CreateGitRepositoryInput } from "../../../../models";
import { formatError } from "../../../../util/error";
import { CreateGitFormSchema } from "./CreateGitFormSchema/CreateGitFormSchema";
import "./GitCreateRepo.scss";
import { GitSelectMenu } from "../../select/GitSelectMenu";

type Props = {
  gitProvider: EnumGitProvider;
  gitOrganizationId: string;
  gitOrganizationName: string;
  useGroupingForRepositories?: boolean;
  repoCreated: {
    isRepoCreateLoading: boolean;
    RepoCreatedError: ApolloError;
  };
  onCreateGitRepository: (data: CreateGitRepositoryInput) => void;
};

const CLASS_NAME = "git-create-repo";

export default function GitCreateRepo({
  gitProvider,
  gitOrganizationId,
  gitOrganizationName,
  useGroupingForRepositories,
  repoCreated,
  onCreateGitRepository,
}: Props) {
  const initialValues: Partial<CreateGitRepositoryInput> = {
    name: "",
    public: true,
  };

  const { data: gitGroupsData } = useQuery(GET_GROUPS, {
    variables: {
      organizationId: gitOrganizationId,
    },
  });

  const gitGroups = gitGroupsData?.gitGroups?.groups;
  const [repositoryGroup, setRepositoryGroup] = useState(null);

  useEffect(() => {
    if (!repositoryGroup && gitGroups && gitGroups.length > 0) {
      setRepositoryGroup(gitGroups[0]);
    }
  }, [gitGroups]);

  const handleCreation = useCallback(
    (data: CreateGitRepositoryInput) => {
      const inputData = repositoryGroup
        ? { ...data, repositoryGroupName: repositoryGroup.name }
        : data;
      onCreateGitRepository(inputData);
    },
    [repositoryGroup]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleCreation}
      validationSchema={CreateGitFormSchema}
      validateOnChange={false}
      validateOnBlur
    >
      {({ errors: formError, values, handleChange }) => (
        <Form className={CLASS_NAME}>
          <div className={`${CLASS_NAME}__header`}>
            Create a new {gitProvider} repository to sync your resource with
          </div>

          {useGroupingForRepositories && (
            <>
              <div className={`${CLASS_NAME}__label`}>Change workspace</div>
              <GitSelectMenu
                gitProvider={gitProvider}
                selectedItem={repositoryGroup}
                items={gitGroups}
                onSelect={setRepositoryGroup}
              />
            </>
          )}

          <div>
            <ToggleField
              name="public"
              label={values.public ? "Public Repo" : "Private Repo"}
              checked={values.public}
              onChange={handleChange}
            />
          </div>

          <div className={`${CLASS_NAME}__label`}>Repository name</div>
          <TextField
            autoFocus
            name="name"
            autoComplete="off"
            showError={false}
          />

          <HorizontalRule />

          <Button
            type="submit"
            className={`${CLASS_NAME}__button`}
            disabled={repoCreated.isRepoCreateLoading}
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
            text={
              formError.name || formatError(repoCreated.RepoCreatedError) || ""
            }
            type="error"
          />
        </Form>
      )}
    </Formik>
  );
}

const GET_GROUPS = gql`
  query gitGroups($organizationId: String!) {
    gitGroups(where: { organizationId: $organizationId }) {
      total
      page
      pageSize
      groups {
        id
        name
        slug
      }
    }
  }
`;
