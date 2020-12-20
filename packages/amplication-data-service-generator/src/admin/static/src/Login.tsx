import React, { useCallback } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { Formik, Form } from "formik";
import {
  Panel,
  PanelHeader,
  TextField,
  Button,
  EnumPanelStyle,
} from "@amplication/design-system";
import { Credentials } from "./auth";
import { api } from "./api";
import "./login.scss";

export type Props = {
  onLogin: (credentials: Credentials) => void;
};

const INITIAL_VALUES = {
  username: "",
  password: "",
};

const Login = ({ onLogin }: Props) => {
  const [login, { error }] = useMutation<unknown, AxiosError, Credentials>(
    async (data) => api.post("/api/login", data),
    {
      onSuccess: (data, variables) => {
        onLogin(variables);
      },
    }
  );
  const handleSubmit = useCallback(
    (values) => {
      login(values);
    },
    [login]
  );
  return (
    <div className="login-page">
      <Panel panelStyle={EnumPanelStyle.Bordered}>
        <PanelHeader>Sign In</PanelHeader>
        <div className="message">
          By default, your app comes with one user with the username "admin" and
          password "admin".
        </div>
        <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
          <Form>
            <TextField label="Username" name="username" type="text" />
            <TextField label="Password" name="password" type="password" />
            <Button type="submit">Continue</Button>
          </Form>
        </Formik>
        {error && error.response?.data?.message}

        <div className="docs">
          <a href="/api">View API Docs</a>
        </div>
      </Panel>
    </div>
  );
};

export default Login;
