import { TextField, Snackbar } from "@amplication/ui/design-system";
import { gql, useMutation, Reference } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
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
          eventName: AnalyticsEventNames.ApiTokenCreate,
          tokenName: data.createApiToken.name,
        });
        onCompleted(data.createApiToken);
      },
      update(cache, { data }) {
        if (!data) return;

        const newToken = data.createApiToken;

        cache.modify({
          fields: {
            userApiTokens(existingTokenRefs = [], { readField }) {
              const newTokenRef = cache.writeFragment({
                data: newToken,
                fragment: NEW_API_TOKEN_FRAGMENT,
              });

              if (
                existingTokenRefs.some(
                  (TokenRef: Reference) =>
                    readField("id", TokenRef) === newToken.id
                )
              ) {
                return existingTokenRefs;
              }

              return [newTokenRef, ...existingTokenRefs];
            },
          },
        });
      },
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

const NEW_API_TOKEN_FRAGMENT = gql`
  fragment NewUserApiToken on userApiToken {
    id
    createdAt
    updatedAt
    name
    userId
    token
    previewChars
    lastAccessAt
  }
`;
