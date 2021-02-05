import React, { useContext, useCallback } from "react";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import { GlobalHotKeys } from "react-hotkeys";
import { gql, useMutation } from "@apollo/client";
import PendingChangesContext from "./PendingChangesContext";
import { formatError } from "../util/error";
import { GET_PENDING_CHANGES } from "./PendingChanges";
import { GET_LAST_COMMIT } from "./LastCommit";
import { TextField } from "@amplication/design-system";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./Commit.scss";

type TCommit = {
  message: string;
};

const INITIAL_VALUES: TCommit = {
  message: "",
};

type Props = {
  applicationId: string;
  disabled: boolean;
};
const CLASS_NAME = "commit";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const Commit = ({ applicationId, disabled }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const [commit, { error, loading }] = useMutation(COMMIT_CHANGES, {
    onError: () => {
      pendingChangesContext.setCommitRunning(false);
    },
    onCompleted: () => {
      pendingChangesContext.setCommitRunning(false);
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
      pendingChangesContext.reset();
    },
    [applicationId, commit, pendingChangesContext]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      {/* {loading ? (
        <CircularProgress />
      ) : ( */}
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
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <TextField
                rows={3}
                textarea
                name="message"
                label="Type in a commit message"
                disabled={loading || disabled}
                autoFocus
                hideLabel
                placeholder={disabled ? "" : "Type in a commit message"}
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                eventData={{
                  eventName: "commit",
                }}
                disabled={loading || disabled}
              >
                Commit Changes
              </Button>
            </Form>
          );
        }}
      </Formik>
      {/* )} */}
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
