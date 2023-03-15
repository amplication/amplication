import {
  Button,
  CircularProgress,
  Label,
  TextField,
  ToggleField,
} from "@amplication/design-system";
import { ApolloError } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { EnumGitProvider, CreateGitRepositoryInput } from "../../../../models";
import { formatError } from "../../../../util/error";
import { CreateGitFormSchema } from "./CreateGitFormSchema/CreateGitFormSchema";
import "./GitCreateRepo.scss";

type Props = {
  gitProvider: EnumGitProvider;
  gitOrganizationName: string;
  repoCreated: {
    isRepoCreateLoading: boolean;
    RepoCreatedError: ApolloError;
  };
  onCreateGitRepository: (data: CreateGitRepositoryInput) => void;
};

const CLASS_NAME = "git-create-repo";

export default function GitCreateRepo({
  gitProvider,
  gitOrganizationName,
  repoCreated,
  onCreateGitRepository,
}: Props) {
  const initialValues: Partial<CreateGitRepositoryInput> = {
    name: "",
    public: true,
  };

  const handleCreation = useCallback((data: CreateGitRepositoryInput) => {
    onCreateGitRepository(data);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleCreation}
      validationSchema={CreateGitFormSchema}
      validateOnChange={false}
      validateOnBlur
    >
      {({ errors: formError, values, handleChange }) => (
        <Form>
          <div className={`${CLASS_NAME}__header`}>
            <h4>
              Create a new {gitProvider} repository to sync your resource with
            </h4>
            <br />
          </div>
          <div>
            <ToggleField
              name="public"
              label={values.public ? "Public Repo" : "Private Repo"}
              checked={values.public}
              onChange={handleChange}
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
                />
              </td>
            </tr>
          </table>
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
