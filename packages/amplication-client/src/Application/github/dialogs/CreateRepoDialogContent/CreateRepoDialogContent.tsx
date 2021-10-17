import { Button, TextField } from "@amplication/design-system";
import { useMutation, gql } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  appId: string;
  sourceControlService: string;
  setOpen: Function;
};

export default function CreateRepoDialogContent({
  appId,
  sourceControlService,
  setOpen,
}: Props) {
  const initialValues = { name: "" };
  const [error, setError] = useState("");
  const [triggerCreation, { data: repoResponse, called }] = useMutation(
    CREATE_REPO
  );
  const handleSubmit = useCallback(
    (data) => {
      triggerCreation({
        variables: { name: data.name, appId, sourceControlService },
      }).catch((error) => {
        console.log(error);

        setError(error.graphQLErrors[0].message);
      });
      // trackEvent({
      //   eventName: "updateAppSettings",
      // }); //TODO what is that
    },
    [appId, sourceControlService, triggerCreation]
  );

  useEffect(() => {
    console.log(repoResponse);
  }, [repoResponse]);
  useEffect(() => {
    if (called) {
      if (repoResponse) {
        setOpen(false);
      }
    }
  }, [called, repoResponse, setOpen]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      //TODO add validation
      //TODO add private option
      //TODO style the error message
    >
      {({}) => (
        <Form>
          <TextField
            name="name"
            type="text"
            autoComplete="off"
            label="Repository name"
          />
          <div>{error}</div>
          <Button type="submit">Let go!</Button>
        </Form>
      )}
    </Formik>
  );
}

const CREATE_REPO = gql`
  mutation createRepoInOrg(
    $sourceControlService: EnumSourceControlService!
    $appId: String!
    $name: String!
  ) {
    createRepoInOrg(
      appId: $appId
      sourceControlService: $sourceControlService
      input: { name: $name }
    ) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
