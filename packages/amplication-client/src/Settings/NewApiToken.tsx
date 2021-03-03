import { TextField } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { GET_API_TOKENS } from "./ApiTokenList";
import "./NewApiToken.scss";

type DType = {
  createApiToken: models.ApiToken;
};

const INITIAL_VALUES: models.ApiTokenCreateInput = {
  name: "",
};

type Props = {
  onCompleted: (token: models.ApiToken) => void;
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
  },
};
const CLASS_NAME = "new-api-token";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewApiToken = ({ onCompleted }: Props) => {
  const { trackEvent } = useTracking();

  const [createApiToken, { error, loading }] = useMutation<DType>(
    CREATE_API_TOKEN,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "createApiToken",
          entityName: data.createApiToken.name,
        });
        onCompleted(data.createApiToken);
      },
      refetchQueries: [{ query: GET_API_TOKENS }],
    }
  );

  const handleSubmit = useCallback(
    (data: models.ApiTokenCreateInput) => {
      createApiToken({
        variables: {
          data,
        },
      }).catch(console.error);
    },
    [createApiToken]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__instructions`}>
        Give the new token a descriptive name.
      </div>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: models.ApiTokenCreateInput) =>
          validate(values, FORM_SCHEMA)
        }
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
                name="name"
                label="Token Name"
                disabled={loading}
                autoFocus
                hideLabel
                placeholder="Token Name"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
              >
                Create Token
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewApiToken;

const CREATE_API_TOKEN = gql`
  mutation createApiToken($data: ApiTokenCreateInput!) {
    createApiToken(data: $data) {
      id
      createdAt
      updatedAt
      name
      userId
      token
      previewChars
      lastAccessAt
    }
  }
`;
