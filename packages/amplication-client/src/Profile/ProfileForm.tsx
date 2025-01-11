import React, { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { GET_USER, UPDATE_ACCOUNT } from "./accountQueries";
import { Form, Formik } from "formik";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./ProfileForm.scss";

type TData = {
  me: {
    account: models.Account;
  };
};

const { AT_LEAST_TWO_CHARACTERS } = validationErrorMessages;

const FORM_SCHEMA = {
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      minLength: 2,
    },
    lastName: {
      type: "string",
      minLength: 2,
    },
  },
  errorMessage: {
    properties: {
      firstName: AT_LEAST_TWO_CHARACTERS,
      lastName: AT_LEAST_TWO_CHARACTERS,
    },
  },
};

const CLASS_NAME = "profile-form";

const ProfileForm = () => {
  const { data, error, refetch } = useQuery<TData>(GET_USER);

  const [updateAccount, { error: updateError, loading }] =
    useMutation<TData>(UPDATE_ACCOUNT);

  const { trackEvent } = useTracking();

  const handleSubmit = useCallback(
    (newData) => {
      const { firstName, lastName } = newData;
      trackEvent({
        eventName: AnalyticsEventNames.AccountInfoUpdate,
      });
      updateAccount({
        variables: {
          data: {
            firstName,
            lastName,
          },
        },
      })
        .then(() => refetch())
        .catch(console.error);
    },
    [trackEvent, updateAccount, refetch]
  );

  const errorMessage = formatError(error || updateError);

  return data ? (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={data.me.account}
        validate={(values: models.Account) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={handleSubmit}
        validateOnChange
      >
        {(formik) => {
          return (
            <>
              <hr className={`${CLASS_NAME}__divider`} />
              <Form>
                <FlexItem
                  direction={EnumFlexDirection.Column}
                  margin={EnumFlexItemMargin.Bottom}
                  gap={EnumGapSize.Small}
                >
                  <Text textStyle={EnumTextStyle.Label}>Account ID: </Text>
                  <Text textStyle={EnumTextStyle.Tag}>
                    {data.me.account.id}
                  </Text>
                </FlexItem>

                <TextField name="email" label="Email" disabled />
                <TextField
                  name="firstName"
                  label="First Name"
                  disabled={loading}
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  disabled={loading}
                />
                <div className={`${CLASS_NAME}__submitButton`}>
                  <Button
                    type="submit"
                    buttonStyle={EnumButtonStyle.Primary}
                    disabled={!formik.isValid || !formik.dirty || loading}
                  >
                    Save changes
                  </Button>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  ) : null;
};

export default ProfileForm;
