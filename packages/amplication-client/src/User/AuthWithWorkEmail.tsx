import {
  EnumTextStyle,
  Form,
  Text,
  TextField,
  CircularProgress,
} from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import { Formik } from "formik";
import { useCallback } from "react";
import { Button } from "../Components/Button";
import { ErrorMessage } from "../Components/ErrorMessage";
import { REACT_APP_AUTH_LOGIN_URI } from "../env";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./AuthWithWorkEmail.scss";
import { SIGNUP_WITH_BUSINESS_EMAIL } from "./UserQueries";

type FormValues = {
  work_email: string;
};

interface SignUpWithBusinessEmail {
  signUpWithBusinessEmail: {
    message: string;
  };
}

const INITIAL_VALUES: FormValues = {
  work_email: "",
};

const CLASS_NAME = "auth-with-work-email";

export const AuthWithWorkEmail: React.FC = () => {
  const { trackEvent } = useTracking();
  const [signUpWithBusinessEmail, { data, loading, error }] =
    useMutation<SignUpWithBusinessEmail>(SIGNUP_WITH_BUSINESS_EMAIL);

  const handleSubmit = (data: FormValues) => {
    trackEvent({
      eventName: AnalyticsEventNames.SignUpWithEmailPassword,
    });
    signUpWithBusinessEmail({
      variables: {
        data: {
          email: data.work_email,
        },
      },
    }).catch(console.error);
  };

  const handleLoginClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.EmailLogin,
    });
  }, [trackEvent, AnalyticsEventNames]);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {(formik) => {
          return (
            <Form childrenAsBlocks>
              <div className={`${CLASS_NAME}__or`}>
                <span>or</span>
              </div>
              {data && (
                <div className={`${CLASS_NAME}__reset_message`}>
                  Signup successful!
                  <br />
                  Please check your inbox to complete registration and set your
                  password.
                </div>
              )}
              {loading && <CircularProgress centerToParent />}
              <>
                <div>
                  <TextField
                    className={`${CLASS_NAME}__work_email`}
                    name="work_email"
                    type="email"
                    placeholder="name@company.com"
                  />

                  <div className="login-button">
                    <Button
                      type="submit"
                      eventData={{
                        eventName: AnalyticsEventNames.SignInWithUserName,
                      }}
                      disabled={!formik.values.work_email.length || loading}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
                <div>
                  <Text textStyle={EnumTextStyle.Tag}>
                    Already have an account?{" "}
                  </Text>
                  <Text textStyle={EnumTextStyle.Tag} underline>
                    <a
                      href={REACT_APP_AUTH_LOGIN_URI}
                      onClick={handleLoginClick}
                    >
                      Login
                    </a>
                  </Text>
                </div>
              </>

              {error && <ErrorMessage errorMessage={error?.message} />}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
