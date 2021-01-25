import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { GlobalHotKeys } from "react-hotkeys";

import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { GET_APPLICATIONS } from "./Applications";
import { formatError } from "../util/error";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { validate } from "../util/formikValidateJsonSchema";

import { TextField } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";
import "./NewApplication.scss";

type Values = {
  name: string;
  description: string;
};

type TData = {
  createApp: models.App;
};

const INITIAL_VALUES = {
  name: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
    description: {
      type: "string",
    },
  },
};
const CLASS_NAME = "new-application";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewApplication = () => {
  const { trackEvent } = useTracking();

  const history = useHistory();
  const [createApp, { loading, data, error }] = useMutation<TData>(CREATE_APP, {
    onCompleted: (data) => {
      trackEvent({
        eventName: "createApp",
        appName: data.createApp.name,
      });
    },
    update(cache, { data }) {
      if (!data) return;
      const queryData = cache.readQuery<{ apps: Array<models.App> }>({
        query: GET_APPLICATIONS,
      });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_APPLICATIONS,
        data: {
          apps: queryData.apps.concat([data.createApp]),
        },
      });
    },
  });

  const handleSubmit = useCallback(
    (data: Values) => {
      createApp({ variables: { data } }).catch(console.error);
    },
    [createApp]
  );

  const errorMessage = formatError(error);

  useEffect(() => {
    if (data) {
      history.push(`/${data.createApp.id}`);
    }
  }, [history, data]);

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.Entities} />

      <div className={`${CLASS_NAME}__instructions`}>
        Give your new app a descriptive name. <br />
      </div>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Values) => validate(values, FORM_SCHEMA)}
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
                label="Name"
                autoComplete="off"
                disabled={loading}
              />
              
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
                type="submit"
              >
                Create App
              </Button>
              {loading && (
                <div className={`${CLASS_NAME}__loader`}>
                  <CircularProgress />
                </div>
              )}
              <Snackbar open={Boolean(error)} message={errorMessage} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewApplication;

const CREATE_APP = gql`
  mutation createApp($data: AppCreateInput!) {
    createApp(data: $data) {
      id
      name
      description
    }
  }
`;
