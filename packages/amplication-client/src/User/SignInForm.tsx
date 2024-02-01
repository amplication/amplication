import {
  CircularProgress,
  Form,
  TextField,
} from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import { useCallback, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button } from "../Components/Button";
import { ErrorMessage } from "../Components/ErrorMessage";
import { setToken } from "../authentication/authentication";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";

type Values = {
  email: string;
  password: string;
};

const INITIAL_VALUES: Values = {
  email: "",
  password: "",
};

const SignInForm = () => {
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
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      <Form childrenAsBlocks>
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
        <div>
          Do not have an account? <Link to="/signup">Sign up</Link>
        </div>
        {loading && <CircularProgress centerToParent />}
      </Form>
    </Formik>
  );
};

export default SignInForm;

const DO_LOGIN = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
    }
  }
`;
