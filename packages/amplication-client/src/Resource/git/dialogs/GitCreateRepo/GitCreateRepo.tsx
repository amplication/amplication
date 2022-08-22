import { Resource } from "@amplication/code-gen-types/dist/models";
import {
  Button,
  CircularProgress,
  Label,
  TextField,
  ToggleField,
} from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { EnumGitProvider, CreateGitRepositoryInput } from "../../../../models";
import { useTracking } from "../../../../util/analytics";
import { formatError } from "../../../../util/error";
import { CreateGitFormSchema } from "./CreateGitFormSchema/CreateGitFormSchema";
import "./GitCreateRepo.scss";

type Props = {
  gitProvider: EnumGitProvider;
  resource: Resource;
  gitOrganizationId: string;
  onCompleted: Function;
  gitOrganizationName: string;
};

const CLASS_NAME = "git-create-repo";

export default function GitCreateRepo({
  resource,
  gitOrganizationId,
  gitProvider,
  onCompleted,
  gitOrganizationName,
}: Props) {
  const initialValues: CreateGitRepositoryInput = { name: "", public: true };
  const { trackEvent } = useTracking();

  const [triggerCreation, { loading, error }] = useMutation(
    CREATE_GIT_REPOSITORY_IN_ORGANIZATION,
    {
      onCompleted: (data) => {
        onCompleted();

        trackEvent({
          eventName: "createGitRepo",
        });
      },
    }
  );

  const handleCreation = useCallback(
    (data: CreateGitRepositoryInput) => {
      triggerCreation({
        variables: {
          name: data.name,
          gitOrganizationId,
          gitProvider,
          public: data.public,
          resourceId: resource.id,
        },
      }).catch((error) => {});
    },
    [resource.id, gitOrganizationId, gitProvider, triggerCreation]
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
        <Form>
          <div className={`${CLASS_NAME}__header`}>
            <h4>
              Create a new {gitProvider} repository to sync your resource
              with
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
                <TextField autoFocus name="name" autoComplete="off" showError={false} />
              </td>
            </tr>
          </table>
          <Button
            type="submit"
            className={`${CLASS_NAME}__button`}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress className={`${CLASS_NAME}__progress`} />
            ) : (
              "Create new repository"
            )}
          </Button>
          <Label
            text={formError.name || formatError(error) || ""}
            type="error"
          />
        </Form>
      )}
    </Formik>
  );
}

const CREATE_GIT_REPOSITORY_IN_ORGANIZATION = gql`
  mutation createGitRepository(
    $gitProvider: EnumGitProvider!
    $gitOrganizationId: String!
    $resourceId: String!
    $name: String!
    $public: Boolean!
  ) {
    createGitRepository(
      data: {
        name: $name
        public: $public
        gitOrganizationId: $gitOrganizationId
        resourceId: $resourceId
        gitProvider: $gitProvider
        gitOrganizationType: Organization
      }
    ) {
      id
      gitRepository {
        id
      }
    }
  }
`;
