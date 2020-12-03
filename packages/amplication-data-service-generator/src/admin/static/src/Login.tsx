import React, { useCallback } from "react";
import { useMutation } from "react-query";
import { Formik, Form } from "formik";
import { TextField, Button } from "@amplication/design-system";
import { Credentials } from "./auth";
import { api } from "./api";

export type Props = {
  onLogin: (credentials: Credentials) => void;
};

const INITIAL_VALUES = {
  username: "",
  password: "",
};

const Login = ({ onLogin }: Props) => {
  const [login, { error }] = useMutation<unknown, Error, Credentials>((data) =>
    api.post("/login", data)
  );
  const handleSubmit = useCallback(
    (values) => {
      login(values).then(() => onLogin(values));
    },
    [login, onLogin]
  );
  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <TextField name="username" type="text" />
          <TextField name="password" type="password" />
          <Button type="submit" />
        </Form>
      </Formik>
      <h3>Error</h3>
      {error ? error.toString() : "No Error"}
    </>
  );
};

export default Login;
