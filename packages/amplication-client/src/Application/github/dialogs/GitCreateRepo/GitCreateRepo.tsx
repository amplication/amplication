import { Button, TextField, ToggleField } from "@amplication/design-system";
import { Form, Formik } from "formik";
import React from "react";
import useGitCreate from "../../../../hooks/git/useGitCreate";
import useGitSelected from "../../../../hooks/git/useGitSelected";
import useGitUserName from "../../../../hooks/git/useGitUserName";
import {
  App,
  EnumSourceControlService,
  RepoCreateInput,
} from "../../../../models";
import "./GitCreateRepo.scss";

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
  const initialValues: RepoCreateInput = { name: "", public: false };

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
        console.log(values);
        handleCreation(values);
      }}
    >
      {({ setValues, values }) => (
        <Form>
          <div className={`${CLASS_NAME}__header`}>
            <h3>
              Create a new {sourceControlService} repository to sync your
              application with
            </h3>
          </div>
          <table>
            <tr>
              <th>Owner</th>
              <th>Repository name</th>
            </tr>
            <tr>
              <td>{username}/</td>
              <td>
                <TextField name="name" />
              </td>
            </tr>
          </table>
          <ToggleField label="Create repository as public" name="public" />
          <Button
            type="submit"
            className={`${CLASS_NAME}__button`}
            disabled={loading}
          >
            Create
          </Button>
          <div>{error}</div>
          {JSON.stringify(values)}
        </Form>
      )}
    </Formik>
  );
}
