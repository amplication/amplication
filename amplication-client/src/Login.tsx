import React, { useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
      }).catch(
        console.error
      ); /** @todo figure out why apollo mutation error does not work */
    },
    [login]
  );

  useEffect(() => {
    if (data) {
      setToken(data.token);
      // @ts-ignore
      const { from } = location.state || { from: { pathname: "/" } };
      history.replace(from);
    }
  }, [data]);

  const errorMessage = error?.graphQLErrors?.[0].message;

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="email" type="email" autoComplete="email" />
      <TextField
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={8}
      />
      <Button raised>Login</Button>
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
