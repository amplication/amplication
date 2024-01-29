import {
  EnumTextAlign,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";
import queryString from "query-string";
import { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { ErrorMessage } from "../Components/ErrorMessage";
import WelcomePage from "../Layout/WelcomePage";
import {
  REACT_APP_AUTH_LOGIN_URI,
  REACT_APP_GITHUB_AUTH_ENABLED,
} from "../env";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { AuthWithWorkEmail } from "./AuthWithWorkEmail";
import { GitHubLoginButton } from "./GitHubLoginButton";
import "./Login.scss";
import SignInForm from "./SignInForm";
import { DEFAULT_PAGE_SOURCE, SIGN_IN_PAGE_CONTENT } from "./constants";

const PAGE_CONTENT = SIGN_IN_PAGE_CONTENT[DEFAULT_PAGE_SOURCE];

const CLASS_NAME = "login-page";

const Login = () => {
  const location = useLocation();
  const { trackEvent } = useTracking();

  const handleContinueWithSsoClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ContinueWithSSOClick,
    });
  }, [trackEvent]);

  const urlError = useMemo(() => {
    const params = queryString.parse(location.search);

    return params.error;
  }, [location.search]);

  return (
    <WelcomePage {...PAGE_CONTENT}>
      <Helmet>
        <title>Amplication | Login</title>
      </Helmet>
      <span className={`${CLASS_NAME}__title`}>Hi There</span>

      {REACT_APP_GITHUB_AUTH_ENABLED &&
      JSON.parse(REACT_APP_GITHUB_AUTH_ENABLED) ? (
        <>
          <div className={`${CLASS_NAME}__message`}>
            Start a 14-days free trial of our Enterprise plan
          </div>
          <GitHubLoginButton />

          <AuthWithWorkEmail />
          {urlError && <ErrorMessage errorMessage={urlError} />}
        </>
      ) : (
        <SignInForm />
      )}
      <Text
        textStyle={EnumTextStyle.Tag}
        underline
        textAlign={EnumTextAlign.Center}
        className={`${CLASS_NAME}__sso-link`}
      >
        <a href={REACT_APP_AUTH_LOGIN_URI} onClick={handleContinueWithSsoClick}>
          Continue with SSO
        </a>
      </Text>
    </WelcomePage>
  );
};

export default Login;
