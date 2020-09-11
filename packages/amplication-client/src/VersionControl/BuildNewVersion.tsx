import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";

import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { formatError } from "../util/error";
import { TextField } from "../Components/TextField";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";

type BuildType = {
  message: string;
  version: string;
};
const INITIAL_VALUES: BuildType = {
  message: "",
  version: "",
};

type Props = {
  applicationId: string;
  onComplete: () => void;
};

const BuildNewVersion = ({ applicationId, onComplete }: Props) => {
  /** @todo update cache */
  const [createBuild, { loading, error }] = useMutation<{
    createBuild: models.Build;
  }>(CREATE_BUILD, {
    onCompleted: (data) => {
      onComplete();
    },
    variables: {
      appId: applicationId,
    },
  });

  const handleBuildButtonClick = useCallback(
    (data: BuildType) => {
      createBuild({
        variables: {
          message: data.message,
          version: data.version,
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [createBuild, applicationId]
  );
  const errorMessage = error && formatError(error);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleBuildButtonClick}>
        <Form>
          <TextField
            required
            rows={3}
            textarea
            name="message"
            label="What's new in this build?"
            disabled={loading}
            autoFocus
            hideLabel
            placeholder="Build description"
            autoComplete="off"
          />
          <TextField
            required
            name="version"
            label="version"
            disabled={loading}
            placeholder="Version"
            autoComplete="off"
          />
          <Button buttonStyle={EnumButtonStyle.Primary}>
            Build New Version
          </Button>
        </Form>
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default BuildNewVersion;

const CREATE_BUILD = gql`
  mutation($appId: String!, $version: String!, $message: String!) {
    createBuild(
      data: {
        app: { connect: { id: $appId } }
        version: $version
        message: $message
      }
    ) {
      id
      createdAt
      createdBy {
        id
      }
      status
    }
  }
`;
