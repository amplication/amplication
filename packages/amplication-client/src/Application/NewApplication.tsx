import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Form, Formik } from "formik";

import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { GET_APPLICATIONS } from "./Applications";
import { formatError } from "../util/error";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { validate } from "../util/formikValidateJsonSchema";

import { TextField } from "../Components/TextField";
import { Button, EnumButtonStyle } from "../Components/Button";

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
    <Formik
      initialValues={INITIAL_VALUES}
      validate={(values: Values) => {
        return validate<Values>(values, FORM_SCHEMA);
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="instructions">
          Give your new app a descriptive name. <br />
          <b>Small step for man big step for humanity...</b>
        </div>
        <TextField name="name" label="Name" autoComplete="off" />
        <TextField
          name="description"
          label="Description"
          autoComplete="off"
          textarea
        />
        <Button buttonStyle={EnumButtonStyle.Primary} type="submit">
          Create App
        </Button>
        {loading && <CircularProgress />}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </Form>
    </Formik>
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
