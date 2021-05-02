import React, { useCallback, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import "@rmwc/circular-progress/styles";
import { setToken } from "../authentication/authentication";
import { formatError } from "../util/error";
import { Formik, Form } from "formik";
import WelcomePage from "../Layout/WelcomePage";
import { TextField } from "@amplication/design-system";
import { Button } from "../Components/Button";
import "./Signup.scss";

type Values = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  address: string;
};

const CLASS_NAME = "signup-page";

const INITIAL_VALUES: Values = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  organizationName: "",
  address: "",
};

const Signup = () => {
  const history = useHistory();
  const location = useLocation();
  const [signup, { loading, data, error }] = useMutation(DO_SIGNUP);

  const handleSubmit = useCallback(
    (values) => {
      const { confirmPassword, ...data } = values; // eslint-disable-line @typescript-eslint/no-unused-vars
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

  useEffect(() => {
    if (data) {
      setToken(data.signup.token);
      // @ts-ignore
      const { from } = location.state || { from: { pathname: "/create-app" } };
      history.replace(from);
    }
  }, [data, history, location]);

  const errorMessage = formatError(error);

  return (
    <WelcomePage>
      <span className={`${CLASS_NAME}__title`}>Sign Up</span>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
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
            autoComplete="new-password"
            minLength={8}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="newPassword"
            minLength={8}
            helpText="Confirm Password should match Password exactly"
            // invalid={formik.values.password !== formik.values.confirmPassword}
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
            name="organizationName"
            type="text"
            autoComplete="organization"
          />

          <Button>Continue</Button>
          <p className={`${CLASS_NAME}__signup`}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
          {loading && <CircularProgress />}
          <Snackbar open={Boolean(error)} message={errorMessage} />
        </Form>
      </Formik>
    </WelcomePage>
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
