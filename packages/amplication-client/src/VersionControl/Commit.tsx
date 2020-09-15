import React, { useCallback, useContext } from "react";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import { track, useTracking } from "../util/analytics";

import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { formatError } from "../util/error";
import { GET_PENDING_CHANGES } from "./PendingChanges";
import { TextField } from "../Components/TextField";
import { Button, EnumButtonStyle } from "../Components/Button";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

type CommitType = {
  message: string;
};
const INITIAL_VALUES: CommitType = {
  message: "",
};

type Props = {
  applicationId: string;
  onComplete: () => void;
};

const Commit = ({ applicationId, onComplete }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);

  const [commit, { error, loading }] = useMutation(COMMIT_CHANGES, {
    onCompleted: (data) => {
      trackEvent({ eventType: "commit" });
      pendingChangesContext.reset();
      onComplete();
    },
    refetchQueries: [
      {
        query: GET_PENDING_CHANGES,
        variables: {
          applicationId: applicationId,
        },
      },
    ],
  });

  const handleSubmit = useCallback(
    (data: CommitType) => {
      commit({
        variables: {
          message: data.message,
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [applicationId, commit]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <TextField
            required
            rows={3}
            textarea
            name="message"
            label="Type in a commit message"
            disabled={loading}
            autoFocus
            hideLabel
            placeholder="Type in a commit message"
            autoComplete="off"
          />
          <Button buttonStyle={EnumButtonStyle.Primary}>Commit</Button>
        </Form>
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default track({
  page: "Commit",
})(Commit);

const COMMIT_CHANGES = gql`
  mutation commit($message: String!, $appId: String!) {
    commit(data: { message: $message, app: { connect: { id: $appId } } }) {
      id
    }
  }
`;
