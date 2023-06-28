import {
  CircularProgress,
  Snackbar,
  TextField,
} from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import { Location } from "history";
import queryString from "query-string";
import { useCallback, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory, useLocation } from "react-router-dom";
import { setToken } from "../authentication/authentication";
import { Button } from "../Components/Button";
import { ErrorMessage } from "../Components/ErrorMessage";
import { Form } from "../Components/Form";
import {
  NX_REACT_APP_AUTH_LOGIN_URI,
  REACT_APP_GITHUB_AUTH_ENABLED,
} from "../env";
import WelcomePage from "../Layout/WelcomePage";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { DEFAULT_PAGE_SOURCE, SIGN_IN_PAGE_CONTENT } from "./constants";
import { GitHubLoginButton } from "./GitHubLoginButton";
import "./Login.scss";
import { useTracking } from "../util/analytics";

type Values = {
  email: string;
  password: string;
};

interface LocationStateInterface {
  from?: Location;
}

const CLASS_NAME = "login-page";
const URL_SOURCE_PARAM = "utm_source";

const INITIAL_VALUES: Values = {
  email: "",
  password: "",
};

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [login, { loading, data, error }] = useMutation(DO_LOGIN);
  const { trackEvent } = useTracking();

  const content = useMemo(() => {
    const s: LocationStateInterface | undefined | null = location.state;
    const urlParams = new URLSearchParams(s?.from?.search);
    const source = urlParams.get(URL_SOURCE_PARAM) || DEFAULT_PAGE_SOURCE;
    return (
      SIGN_IN_PAGE_CONTENT[source] || SIGN_IN_PAGE_CONTENT[DEFAULT_PAGE_SOURCE]
    );
  }, [location.state]);

  const handleSubmit = useCallback(
    (data) => {
      login({
        variables: {
          data,
        },
      }).catch(console.error);
    },
    [login]
  );

  const handleContinueWithSsoClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ContinueWithSSOClick,
    });
  }, [trackEvent]);

  const urlError = useMemo(() => {
    const params = queryString.parse(location.search);

    return params.error;
  }, [location.search]);

  useEffect(() => {
    if (data) {
      setToken(data.login.token);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let { from } = location.state || { from: { pathname: "/" } };
      if (from === "login") {
        from = "/";
      }

      history.replace(`${from.pathname || from}${location.search}`);
    }
  }, [data, history, location]);

  const errorMessage = formatError(error);

  return (
    <WelcomePage {...content}>
      <Helmet>
        <title>Amplication | Login</title>
      </Helmet>
      <span className={`${CLASS_NAME}__title`}>Hi There</span>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form childrenAsBlocks>
          {urlError && <ErrorMessage errorMessage={urlError} />}

          {REACT_APP_GITHUB_AUTH_ENABLED ? (
            <>
              <div className={`${CLASS_NAME}__message`}>
                Welcome to {content.name}. Please use your GitHub account to
                sign&nbsp;in.
              </div>
              <GitHubLoginButton />
              <a
                href={NX_REACT_APP_AUTH_LOGIN_URI}
                className={`${CLASS_NAME}__sso`}
                onClick={handleContinueWithSsoClick}
              >
                Continue with SSO
              </a>
            </>
          ) : (
            <>
              {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
              />
              <Button
                type="submit"
                eventData={{
                  eventName: AnalyticsEventNames.SignInWithUserName,
                }}
              >
                Continue
              </Button>
              <div className={`${CLASS_NAME}__signup`}>
                Do not have an account? <Link to="/signup">Sign up</Link>
              </div>
            </>
          )}

          <div className={`${CLASS_NAME}__policy`}>
            By signing up to {content.name}, you agree to our <br />
            <a href="https://amplication.com/terms" target="terms">
              terms of service
            </a>{" "}
            and&nbsp;
            <a href="https://amplication.com/privacy" target="privacy">
              privacy policy
            </a>
            .
          </div>

          {loading && <CircularProgress centerToParent />}
          <Snackbar open={Boolean(error)} message={errorMessage} />
        </Form>
      </Formik>
    </WelcomePage>
  );
};

export default Login;

const DO_LOGIN = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
    }
  }
`;
