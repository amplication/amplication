import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import * as models from "../models";

import { gql, useMutation, useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import { TextField } from "amplication-design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { validate } from "../util/formikValidateJsonSchema";
import { ReactComponent as ImageSandbox } from "../assets/images/sandbox.svg";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { GET_BUILD } from "./useBuildWatchStatus";
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
  const {
    data,
    error: errorEnvironments,
    loading: loadingEnvironment,
  } = useQuery<{
    app: models.App;
  }>(GET_APP_ENVIRONMENT, {
    variables: {
      id: applicationId,
    },
  });
  const history = useHistory();

  const [deploy, { error: errorDeploy, loading: loadingDeploy }] = useMutation(
    CREATE_DEPLOYMENT,
    {
      onCompleted: (data) => {
        const url = `/${applicationId}/builds/${buildId}/deployments/${data.createDeployment.id}`;
        history.push(url);

        onComplete();
      },
      refetchQueries: [
        {
          query: GET_BUILD,
          variables: {
            buildId: buildId,
          },
        },
      ],
    }
  );

  const handleSubmit = useCallback(
    (formData: DeployType) => {
      if (!data?.app.environments) {
        return;
      }
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
      <ImageSandbox />

      <div className={`${CLASS_NAME}__instructions`}>
        <div className={`${CLASS_NAME}__title`}>Congrats! </div>
        Your app will be deployed to our sandbox environment. <br />
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
                label="Add a short message to describe the deployment"
                disabled={loadingDeploy}
                autoFocus
                placeholder="Description"
                autoComplete="off"
              />
              <div className={`${CLASS_NAME}__notice`}>
                Please note:
                <ul>
                  <li>This is not a production environment</li>
                  <li>
                    Use this deployment for testing and integration from your
                    client application.
                  </li>
                  <li>
                    Previous deployment will be replaced with the new version.
                  </li>
                  <li>
                    Any data that already exist from previous deployments will
                    be deleted.
                  </li>
                </ul>
              </div>
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                eventData={{
                  eventName: "deploy",
                }}
                disabled={
                  !formik.isValid || loadingDeploy || loadingEnvironment
                }
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
