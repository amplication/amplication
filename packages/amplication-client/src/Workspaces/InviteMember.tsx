import { TextField, Snackbar } from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { Form, Formik } from "formik";
import { validate } from "../util/formikValidateJsonSchema";
import { useCallback } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { GET_WORKSPACE_MEMBERS } from "./MemberList";
import "./InviteMember.scss";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";

type Values = {
  email: string;
};

type TData = {
  inviteUser: models.InviteUserInput;
};

const INITIAL_VALUES = {
  email: "",
};

const CLASS_NAME = "invite-member";

const FORM_SCHEMA = {
  required: ["email"],
  properties: {
    email: {
      type: "string",
      minLength: 1,
    },
  },
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const InviteMember = () => {
  const { trackEvent } = useTracking();

  const [inviteUser, { loading, error }] = useMutation<TData>(INVITE_USER, {
    onCompleted: (data) => {
      trackEvent({
        eventName: AnalyticsEventNames.WorkspaceMemberInvite,
        email: data.inviteUser.email,
        eventOriginLocation: "workspace-members-page",
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
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: models.InviteUserInput) =>
          validate(values, FORM_SCHEMA)
        }
        enableReinitialize
        onSubmit={handleSubmit}
      >
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
              <FeatureIndicatorContainer
                featureId={BillingFeature.TeamMembers}
                entitlementType={EntitlementType.Metered}
                limitationText="The workspace reached your plan's team members limitation. "
              >
                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  disabled={!formik.isValid || loading}
                  type="submit"
                >
                  Invite
                </Button>
              </FeatureIndicatorContainer>

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
