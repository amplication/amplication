import React, { useCallback, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form } from "formik";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import { setToken } from "../authentication/authentication";
import { formatError } from "../util/error";
import { TextField } from "../Components/TextField";
import { Button } from "../Components/Button";
import { GitHubLoginButton } from "./GitHubLoginButton";
import WelcomePage from "../Layout/WelcomePage";
import "./Login.scss";

type Values = {
  email: string;
  password: string;
};

const { REACT_APP_GITHUB_CLIENT_ID } = process.env;
const CLASS_NAME = "login-page";

const INITIAL_VALUES: Values = {
  email: "",
  password: "",
};

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [login, { loading, data, error }] = useMutation(DO_LOGIN);

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
    <WelcomePage>
      <span className={`${CLASS_NAME}__title`}>Sign In</span>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <p>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
            />
          </p>
          <p>
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
            />
          </p>
          <p>
            <Button type="submit">Continue</Button>{" "}
            {REACT_APP_GITHUB_CLIENT_ID && <GitHubLoginButton />}
          </p>
          <p className={`${CLASS_NAME}__signup`}>
            Do not have an account? <Link to="/signup">Sign up</Link>
          </p>
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
