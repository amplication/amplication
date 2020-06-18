import React, { useCallback, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@rmwc/circular-progress/circular-progress.css";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/button/dist/mdc.button.css";
import { setToken } from "../authentication/authentication";
import { formatError } from "../util/error";

type Values = {
  email: string;
  password: string;
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
      });
    },
    [login]
  );

  const formik = useFormik<Values>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleSubmit,
  });

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
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={8}
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <Button type="submit" raised>
        Login
      </Button>
      <Link to="/signup">Do not have an account?</Link>
      {loading && <CircularProgress />}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </form>
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
