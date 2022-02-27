import {
  Button,
  CircularProgress,
  Label,
  TextField,
} from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import React from "react";
import { App, EnumGitProvider, RepoCreateInput } from "../../../../models";
import { formatError } from "../../../../util/error";
import useGitCreate from "../../hooks/useGitCreate";
import useGitSelected from "../../hooks/useGitSelected";
import { CreateGitFormSchema } from "./CreateGitFormSchema/CreateGitFormSchema";
import "./GitCreateRepo.scss";

type Props = {
  sourceControlService: EnumGitProvider;
  app: App;
  gitOrganizationId: string;
  onCompleted: Function;
};

const CLASS_NAME = "git-create";

export default function GitCreateRepo({
  app,
  gitOrganizationId,
  sourceControlService,
  onCompleted,
}: Props) {
  const initialValues: RepoCreateInput = { name: "", public: true };

  const { data } = useQuery<{ name: string }>(GET_GIT_ORGANIZATION_NAME, {
    variables: { id: gitOrganizationId },
  });

  const { handleRepoSelected } = useGitSelected({ appId: app.id });
  const { loading, handleCreation, error } = useGitCreate({
    gitOrganizationId: gitOrganizationId,
    appId: app.id,
    sourceControlService,
    cb: (repo) => {
      handleRepoSelected(repo);
      onCompleted();
    },
  });
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleCreation(values);
      }}
      validationSchema={CreateGitFormSchema}
    >
      {({ errors: formError }) => (
        <Form>
          <div className={`${CLASS_NAME}__header`}>
            <h4>
              Create a new {sourceControlService} repository to sync your
              application with
            </h4>
            <br />
          </div>
          <table style={{ width: "100%", marginBottom: "1vh" }}>
            <tr>
              <th>Owner</th>
              <th>Repository name</th>
            </tr>
            <tr>
              <td style={{ position: "relative", top: "-5px" }}>
                {data?.name || ""}/
              </td>
              <td>
                <TextField name="name" autoComplete="off" showError={false} />
              </td>
            </tr>
          </table>
          <Button
            type="submit"
            className={`${CLASS_NAME}__button`}
            disabled={loading}
            style={{ marginBottom: "0.8vh" }}
          >
            {loading ? (
              <CircularProgress style={{ color: "white", margin: "5px" }} />
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

const GET_GIT_ORGANIZATION_NAME = gql`
  query gitOrganization($id: String!) {
    gitOrganization(where: { id: $id }) {
      name
    }
  }
`;
