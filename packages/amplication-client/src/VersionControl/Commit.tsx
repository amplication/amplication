import React, { useContext, useCallback } from "react";
import { Formik, Form } from "formik";
import { GlobalHotKeys } from "react-hotkeys";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";

import { TextField, Snackbar } from "@amplication/design-system";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./Commit.scss";
import { AppContext } from "../context/appContext";
import { GET_COMMITS, GET_LAST_COMMIT } from "./hooks/commitQueries";
import { SortOrder } from "../models";

type TCommit = {
  message: string;
};

const INITIAL_VALUES: TCommit = {
  message: "",
};

type Props = {
  projectId: string;
  noChanges: boolean;
};
const CLASS_NAME = "commit";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const Commit = ({ projectId, noChanges }: Props) => {
  const {
    setCommitRunning,
    resetPendingChanges,
    setPendingChangesError,
    addChange,
  } = useContext(AppContext);
  const [commit, { error, loading }] = useMutation(COMMIT_CHANGES, {
    onError: () => {
      setCommitRunning(false);
      setPendingChangesError(true);
      resetPendingChanges();
    },
    onCompleted: (commit) => {
      setCommitRunning(false);
      setPendingChangesError(false);
      resetPendingChanges();
      addChange(commit.id);
    },
    refetchQueries: [
      {
        query: GET_LAST_COMMIT,
        variables: {
          projectId,
        },
      },
      {
        query: GET_COMMITS,
        variables: {
          projectId,
          orderBy: {
            createdAt: SortOrder.Desc,
          },
        },
      },
    ],
  });

  const handleSubmit = useCallback(
    (data, { resetForm }) => {
      setCommitRunning(true);
      commit({
        variables: {
          message: data.message,
          projectId,
        },
      }).catch(console.error);
      resetForm(INITIAL_VALUES);
      setPendingChangesError(false);
      resetPendingChanges();
    },
    [
      setCommitRunning,
      commit,
      projectId,
      setPendingChangesError,
      resetPendingChanges,
    ]
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
  mutation commit($message: String!, $projectId: String!) {
    commit(
      data: { message: $message, project: { connect: { id: $projectId } } }
    ) {
      id
    }
  }
`;
