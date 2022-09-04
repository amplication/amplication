import React, { useCallback, useEffect, useMemo } from "react";
import { Location } from "history";
import { useHistory, useLocation, Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import { REACT_APP_GITHUB_CLIENT_ID } from "../env";
import { setToken } from "../authentication/authentication";
import { formatError } from "../util/error";
import {
  TextField,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";
import { Button } from "../Components/Button";
import { Form } from "../Components/Form";
import queryString from "query-string";
import { DEFAULT_PAGE_SOURCE, SIGN_IN_PAGE_CONTENT } from "./constants";
import useLocalStorage from "react-use-localstorage";
import { GitHubLoginButton } from "./GitHubLoginButton";
import WelcomePage from "../Layout/WelcomePage";
import { ErrorMessage } from "../Components/ErrorMessage";
import "./Login.scss";

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

export const LOCAL_STORAGE_KEY_INVITATION_TOKEN = "invitationToken";

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [login, { loading, data, error }] = useMutation(DO_LOGIN);

  const [, setInvitationToken] = useLocalStorage(
    LOCAL_STORAGE_KEY_INVITATION_TOKEN,
    undefined
  );

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

  const urlError = useMemo(() => {
    const params = queryString.parse(location.search);
    console.log("params", params);
    console.log("params.error", params.error);
    return params.error;
  }, [location.search]);

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.invitation) {
      //save the invitation token in local storage to be validated by
      //<CompleteInvitation/> after signup or sign in
      //we user local storage since github-passport does not support dynamic callback
      setInvitationToken(params.invitation);
    }
  }, [setInvitationToken, location.search]);

  useEffect(() => {
    if (data) {
      setToken(data.login.token);
      // @ts-ignore
      let { from } = location.state || { from: { pathname: "/" } };
      if (from === "login") {
        from = "/";
      }  
      history.replace(from);
    }
  }, [data, history, location]);

  const errorMessage = formatError(error);

  return (
    <WelcomePage {...content}>
      <span className={`${CLASS_NAME}__title`}>Hi There</span>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form childrenAsBlocks>
          {urlError && <ErrorMessage errorMessage={urlError} />}

          {REACT_APP_GITHUB_CLIENT_ID ? (
            <>
              <div className={`${CLASS_NAME}__message`}>
                Welcome to {content.name}. Please use your GitHub account to
                sign&nbsp;in.
              </div>
              <GitHubLoginButton />
              <div className={`${CLASS_NAME}__signup`}>
                Do not have a GitHub account?{" "}
                <a href="https://github.com/join" target="Github">
                  Join GitHub
                </a>
              </div>
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
                  eventName: "signInWithUserName",
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
            By signing up to {content.name}, you agree to our{" "}
            <a href="https://amplication.com/terms" target="terms">
              terms of service
            </a>{" "}
            and&nbsp;
            <a href="https://amplication.com/privacy" target="privacy">
              privacy policy
            </a>
            .
          </div>

          {loading && <CircularProgress />}
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
