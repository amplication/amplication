import React, { useCallback, useEffect, useState } from "react";
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
import { formatError } from "./errorUtil";
import getFormData from "get-form-data";

const Signup = () => {
  const history = useHistory();
  const location = useLocation();
  const [signup, { loading, data, error }] = useMutation(DO_SIGNUP);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePasswordChange = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );
  const handleConfirmPassword = useCallback(
    (event) => {
      setConfirmPassword(event.target.value);
    },
    [setConfirmPassword]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const data = getFormData(event.target);
      signup({
        variables: {
          data,
        },
      }).catch(
        console.error
      ); /** @todo figure out why apollo mutation error does not work */
    },
    [signup]
  );

  useEffect(() => {
    if (data) {
      setToken(data.signup.token);
      // @ts-ignore
      const { from } = location.state || { from: { pathname: "/" } };
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
        autoComplete="new-password"
        minLength={8}
        onChange={handlePasswordChange}
      />
      <TextField
        label="Confirm Password"
        type="password"
        autoComplete="newPassword"
        minLength={8}
        helpText="Confirm Password should match Password exactly"
        invalid={password !== confirmPassword}
        onChange={handleConfirmPassword}
        value={confirmPassword}
      />
      <TextField
        label="First Name"
        name="firstName"
        type="text"
        autoComplete="given-name"
      />
      <TextField
        label="Last Name"
        name="lastName"
        type="text"
        autoComplete="family-name"
      />
      <TextField
        label="Organization"
        name="organization"
        type="text"
        autoComplete="organization"
      />
      <TextField
        label="Address"
        name="address"
        type="text"
        autoComplete="street-address"
      />
      <Button raised>Sign up</Button>
      {loading && <CircularProgress />}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </form>
  );
};

export default Signup;

const DO_SIGNUP = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      token
    }
  }
`;
