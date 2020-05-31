import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { GET_APPLICATIONS } from "./Applications";
import { formatError } from "./errorUtil";

type Values = {
  name: string;
  description: string;
};

const NewApplication = () => {
  const history = useHistory();
  const [createApp, { loading, data, error }] = useMutation(CREATE_APP, {
    update(cache, { data: { createApp } }) {
      const queryData = cache.readQuery<{
        me: {
          organization: {
            apps: Array<{ id: string; name: string; description: string }>;
          };
        };
      }>({ query: GET_APPLICATIONS });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_APPLICATIONS,
        data: {
          me: {
            organization: {
              apps: queryData.me.organization.apps.concat([createApp]),
            },
          },
        },
      });
    },
  });

  const handleSubmit = useCallback(
    (data) => {
      createApp({ variables: { data } }).catch(console.error);
    },
    [createApp]
  );

  const formik = useFormik<Values>({
    onSubmit: handleSubmit,
    initialValues: {
      name: "",
      description: "",
    },
  });

  const errorMessage = formatError(error);

  useEffect(() => {
    if (data) {
      history.push(`/${data.createApp.id}`);
    }
  }, [history, data]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
      />
      <TextField
        name="description"
        label="Description"
        value={formik.values.description}
        onChange={formik.handleChange}
      />
      <Button type="submit" raised>
        Create
      </Button>
      {loading && <CircularProgress />}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </form>
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
