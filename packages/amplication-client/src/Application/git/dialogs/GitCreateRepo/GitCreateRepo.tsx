import { Button, TextField, Label } from "@amplication/design-system";
import { Form, Formik } from "formik";
import React from "react";
import useGitCreate from "../../hooks/useGitCreate";
import useGitSelected from "../../hooks/useGitSelected";
import useGitUserName from "../../hooks/useGitUserName";
import {
  App,
  EnumSourceControlService,
  RepoCreateInput,
} from "../../../../models";
import { CreateGitFormSchema } from "./CreateGitFormSchema/CreateGitFormSchema";
import "./GitCreateRepo.scss";
import { CircularProgress } from "@rmwc/circular-progress";
import { formatError } from "../../../../util/error";

type Props = {
  sourceControlService: EnumSourceControlService;
  app: App;
  onCompleted: Function;
};

const CLASS_NAME = "git-create";

export default function GitCreateRepo({
  app,
  sourceControlService,
  onCompleted,
}: Props) {
  const initialValues: RepoCreateInput = { name: "", public: true };

  const { username } = useGitUserName({ appId: app.id, sourceControlService });
  const { handleRepoSelected } = useGitSelected({ appId: app.id });
  const { loading, handleCreation, error } = useGitCreate({
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
              <td style={{ position: "relative", top: "-5px" }}>{username}/</td>
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
