import React, { useCallback, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
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
import { setToken } from "./authentication";
import { formatError } from "./errorUtil";

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const [login, { loading, data, error }] = useMutation(DO_LOGIN);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.target);
      login({
        variables: {
          data: {
            email: formData.get("email"),
            password: formData.get("password"),
          },
        },
      });
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
    <form onSubmit={handleSubmit}>
      <TextField label="Email" name="email" type="email" autoComplete="email" />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={8}
      />
      <Button raised>Login</Button>
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
