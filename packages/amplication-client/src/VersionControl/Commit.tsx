import React, { useContext, useCallback } from "react";
import { Formik, Form } from "formik";
import { GlobalHotKeys } from "react-hotkeys";
import { gql, useMutation } from "@apollo/client";
import PendingChangesContext from "./PendingChangesContext";
import { formatError } from "../util/error";
import { GET_PENDING_CHANGES } from "./PendingChanges";
import { GET_LAST_COMMIT } from "./LastCommit";
import { TextField, Snackbar } from "@amplication/design-system";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./Commit.scss";
import { CREATED_AT_FIELD, GET_BUILDS_COMMIT } from "../Application/code-view/CodeViewExplorer";
import { SortOrder } from "../models";

type TCommit = {
  message: string;
};

const INITIAL_VALUES: TCommit = {
  message: "",
};

type Props = {
  applicationId: string;
  noChanges: boolean;
};
const CLASS_NAME = "commit";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const Commit = ({ applicationId, noChanges }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);
  const [commit, { error, loading }] = useMutation(COMMIT_CHANGES, {
    onError: () => {
      pendingChangesContext.setCommitRunning(false);
      pendingChangesContext.setIsError(true);
      pendingChangesContext.reset();
    },
    onCompleted: () => {
      pendingChangesContext.setCommitRunning(false);
      pendingChangesContext.setIsError(false);
    },
    refetchQueries: [
      {
        query: GET_PENDING_CHANGES,
        variables: {
          applicationId,
        },
      },
      {
        query: GET_LAST_COMMIT,
        variables: {
          applicationId,
        },
      },
      {
        query: GET_BUILDS_COMMIT,
        variables: {
          appId: applicationId,
          orderBy: {
            [CREATED_AT_FIELD]: SortOrder.Desc,
          },
        }
      }
    ],
  });

  const handleSubmit = useCallback(
    (data, { resetForm }) => {
      pendingChangesContext.setCommitRunning(true);
      commit({
        variables: {
          message: data.message,
          applicationId,
        },
      }).catch(console.error);
      resetForm(INITIAL_VALUES);
      pendingChangesContext.setIsError(false);
      pendingChangesContext.reset();
    },
    [applicationId, commit, pendingChangesContext]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };

          return (
            <Form>
              {!loading && (
                <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              )}
              <TextField
                rows={3}
                textarea
                name="message"
                label={noChanges ? "Build message" : "Commit message..."}
                disabled={loading}
                autoFocus
                hideLabel
                placeholder={noChanges ? "Build message" : "Commit message..."}
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                eventData={{
                  eventName: "commit",
                }}
                disabled={loading}
              >
                {noChanges ? "Rebuild" : "Commit changes & build "}
              </Button>
            </Form>
          );
        }}
      </Formik>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default Commit;

const COMMIT_CHANGES = gql`
  mutation commit($message: String!, $applicationId: String!) {
    commit(
      data: { message: $message, app: { connect: { id: $applicationId } } }
    ) {
      id
    }
  }
`;
