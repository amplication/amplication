import React, { useCallback } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import * as models from "../models";
import { GET_USER } from "../Components/UserBadge";
import { Form, Formik } from "formik";
import { validate } from "../util/formikValidateJsonSchema";
import FormikAutoSave from "../util/formikAutoSave";
import { Snackbar, TextField } from "@amplication/design-system";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";

type TData = {
  me: {
    account: models.Account;
  };
};

const FORM_SCHEMA = {
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      minLength: 2
    },
    lastName: {
      type: "string",
      minLength: 2
    }
  }
};

const ProfileForm = () => {
  const { data, error, refetch } = useQuery<TData>(GET_USER);

  const [updateAccount, { error: updateError }] = useMutation<TData>(
    UPDATE_ACCOUNT
  );

  const { trackEvent } = useTracking();

  const handleSubmit = useCallback(
    newData => {
      const { firstName, lastName } = newData;
      trackEvent({
        eventName: "updateAccountInfo"
      });
      updateAccount({
        variables: {
          data: {
            firstName,
            lastName
          }
        }
      })
        .then(() => refetch())
        .catch(console.error);
    },
    [trackEvent, updateAccount, refetch]
  );

  const errorMessage = formatError(error || updateError);

  return data ? (
    <div>
      <Formik
        initialValues={data.me.account}
        validate={(values: models.Account) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={handleSubmit}>
        {formik => {
          return (
            <Form>
              <FormikAutoSave debounceMS={1000} />
              <TextField name='email' label='Email' disabled />
              <TextField name='firstName' label='First Name' />
              <TextField name='lastName' label='Last Name' />
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  ) : null;
};

export default ProfileForm;

const UPDATE_ACCOUNT = gql`
  mutation updateAccount($data: UpdateAccountInput!) {
    updateAccount(data: $data) {
      firstName
      lastName
    }
  }
`;
