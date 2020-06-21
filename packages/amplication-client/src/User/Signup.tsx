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
import { setToken } from "../authentication/authentication";
import { formatError } from "../util/error";
import { useFormik } from "formik";

type Values = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  address: string;
};

const Signup = () => {
  const history = useHistory();
  const location = useLocation();
  const [signup, { loading, data, error }] = useMutation(DO_SIGNUP);

  const handleSubmit = useCallback(
    (values) => {
      const { confirmPassword, ...data } = values;
      signup({
        variables: {
          data: {
            ...data,
            defaultTimeZone: "GMT+3",
          },
        },
      }).catch(console.error);
    },
    [signup]
  );

  const formik = useFormik<Values>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      organizationName: "",
      address: "",
    },
    onSubmit: handleSubmit,
  });

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
        autoComplete="new-password"
        minLength={8}
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autoComplete="newPassword"
        minLength={8}
        helpText="Confirm Password should match Password exactly"
        invalid={formik.values.password !== formik.values.confirmPassword}
        onChange={formik.handleChange}
        value={formik.values.confirmPassword}
      />
      <TextField
        label="First Name"
        name="firstName"
        type="text"
        autoComplete="given-name"
        onChange={formik.handleChange}
        value={formik.values.firstName}
      />
      <TextField
        label="Last Name"
        name="lastName"
        type="text"
        autoComplete="family-name"
        onChange={formik.handleChange}
        value={formik.values.lastName}
      />
      <TextField
        label="Organization"
        name="organizationName"
        type="text"
        autoComplete="organization"
        onChange={formik.handleChange}
        value={formik.values.organizationName}
      />
      <TextField
        label="Address"
        name="address"
        type="text"
        autoComplete="street-address"
        onChange={formik.handleChange}
        value={formik.values.address}
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
