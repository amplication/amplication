import { TextField,Snackbar } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { GET_WORKSPACE_MEMBERS } from "./MemberList";
import "./InviteMember.scss";

type Values = {
  email: string;
};

type TData = {
  inviteUser: models.Invitation;
};

const INITIAL_VALUES = {
  email: "",
};

const CLASS_NAME = "invite-member";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const InviteMember = () => {
  const { trackEvent } = useTracking();

  const [inviteUser, { loading, error }] = useMutation<TData>(INVITE_USER, {
    onCompleted: (data) => {
      trackEvent({
        eventName: "inviteUser",
        email: data.inviteUser.email,
      });
    },
    refetchQueries: [{ query: GET_WORKSPACE_MEMBERS }],
  });

  const handleSubmit = useCallback(
    (data: Values) => {
      if (!isEmpty(data.email)) {
        inviteUser({ variables: { email: data.email } }).catch(console.error);
      }
    },
    [inviteUser]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };
          return (
            <Form>
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <TextField
                name="email"
                label=""
                placeholder="email"
                autoComplete="off"
                type="email"
                disabled={loading}
              />
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
                type="submit"
              >
                Invite
              </Button>

              <Snackbar open={Boolean(error)} message={errorMessage} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default InviteMember;

const INVITE_USER = gql`
  mutation inviteUser($email: String!) {
    inviteUser(data: { email: $email }) {
      id
      email
    }
  }
`;
