import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import { GlobalHotKeys } from "react-hotkeys";
import { isEmpty } from "lodash";
import * as models from "../models";

import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { formatError } from "../util/error";
import { TextField } from "../Components/TextField";
import { Button, EnumButtonStyle } from "../Components/Button";
import { validate } from "../util/formikValidateJsonSchema";
import { ReactComponent as ImageDeploy } from "../assets/images/tile-publish.svg";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./Deploy.scss";

type DeployType = {
  message: string;
};
const INITIAL_VALUES: DeployType = {
  message: "",
};

type Props = {
  buildId: string;
  applicationId: string;
  onComplete: () => void;
};
const CLASS_NAME = "deploy";

const FORM_SCHEMA = {
  required: ["message"],
  properties: {
    message: {
      type: "string",
      minLength: 1,
    },
  },
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const Deploy = ({ buildId, applicationId, onComplete }: Props) => {
  const { data, error: errorEnvironments } = useQuery<{
    app: models.App;
  }>(GET_APP_ENVIRONMENT, {
    variables: {
      id: applicationId,
    },
  });

  const [deploy, { error: errorDeploy, loading: loadingDeploy }] = useMutation(
    CREATE_DEPLOYMENT,
    {
      onCompleted: (data) => {
        onComplete();
      },
    }
  );

  const handleSubmit = useCallback(
    (formData: DeployType) => {
      const [environment] = data?.app.environments;

      deploy({
        variables: {
          message: formData.message,
          environmentId: environment.id,
          buildId: buildId,
        },
      }).catch(console.error);
    },
    [buildId, data, deploy]
  );

  const errorMessage =
    formatError(errorDeploy) ||
    (errorEnvironments && formatError(errorEnvironments));

  return (
    <div className={CLASS_NAME}>
      <ImageDeploy />
      {!isEmpty(data?.app.environments) && (
        <div className={`${CLASS_NAME}__instructions`}>
          {/**@todo: Style this section with @lee */}
          {/**@todo: show a warning message about overriding the current deployment  */}
          Your app will be deployed to
          <a
            className={`${CLASS_NAME}__url`}
            href={`https://${data?.app.environments[0].address}.amplication.app`}
          >
            {`https://${data?.app.environments[0].address}.amplication.app`}
          </a>
        </div>
      )}

      <div className={`${CLASS_NAME}__instructions`}>
        Add a short message to describe the deployment
      </div>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: DeployType) => validate(values, FORM_SCHEMA)}
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
                label="Type in a deployment message"
                disabled={loadingDeploy}
                autoFocus
                hideLabel
                placeholder="Type in a deployment message"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                eventData={{
                  eventName: "deploy",
                }}
                disabled={!formik.isValid || loadingDeploy}
              >
                Deploy
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar
        open={Boolean(errorDeploy) || Boolean(errorEnvironments)}
        message={errorMessage}
      />
    </div>
  );
};

export default Deploy;

const CREATE_DEPLOYMENT = gql`
  mutation createDeployment(
    $buildId: String!
    $environmentId: String!
    $message: String
  ) {
    createDeployment(
      data: {
        build: { connect: { id: $buildId } }
        environment: { connect: { id: $environmentId } }
        message: $message
      }
    ) {
      id
    }
  }
`;

export const GET_APP_ENVIRONMENT = gql`
  query getAppEnvironment($id: String!) {
    app(where: { id: $id }) {
      id
      environments {
        id
        name
        description
        address
      }
    }
  }
`;
