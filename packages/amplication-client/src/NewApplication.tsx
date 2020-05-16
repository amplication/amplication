import React, { useCallback, useEffect } from "react";
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import { Button } from "@rmwc/button";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/button/dist/mdc.button.css";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

const NewApplication = () => {
  const history = useHistory();
  const { data: organizationData } = useQuery(GET_ORGANIZATION);
  const [createApp, { loading, data, error }] = useMutation(CREATE_APP);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const description = formData.get("description");
    createApp({ variables: { data: { name, description } } });
  }, []);

  const errorMessage = error?.graphQLErrors?.[0].message;

  useEffect(() => {
    if (data) {
      history.push(
        `/${organizationData.me.organization.id}/${data.createApp.id}`
      );
    }
  }, [history, data, organizationData]);

  return (
    <form onSubmit={handleSubmit}>
      <p>Create app in {organizationData?.me.organization.name}:</p>
      <TextField name="name" label="Name" />
      <TextField name="description" label="Description" />
      <Button raised disabled={!organizationData}>
        Create
      </Button>
      {loading && <CircularProgress />}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </form>
  );
};

export default NewApplication;

const GET_ORGANIZATION = gql`
  query getOrganization {
    me {
      organization {
        id
        name
      }
    }
  }
`;

const CREATE_APP = gql`
  mutation createApp($data: AppCreateInput!) {
    createApp(data: $data) {
      id
    }
  }
`;
