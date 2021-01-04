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
  EnumButtonStyle,
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
      <div className="options-container">
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <PanelHeader>Sign In to Admin UI</PanelHeader>
          <div className="message">
            By default, your app comes with one user with the username "admin"
            and password "admin".
          </div>
          <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
            <Form>
              <TextField label="Username" name="username" type="text" />
              <TextField label="Password" name="password" type="password" />
              <Button type="submit">Continue</Button>
            </Form>
          </Formik>
          {error && error.response?.data?.message}
        </Panel>
        <div className="divider">Or</div>
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <PanelHeader>Connect via API</PanelHeader>
          <div className="message">
            Choose the type of API for connecting to your app.
          </div>
          <a href="/graphql" target="graphql">
            <Button type="button" buttonStyle={EnumButtonStyle.Secondary}>
              GraphQL API
            </Button>
          </a>
          <a href="/api" target="api">
            <Button type="button" buttonStyle={EnumButtonStyle.Secondary}>
              REST API
            </Button>
          </a>
          <hr />
          <div className="message">
            <span>Read </span>
            <a href="https://docs.amplication.com/docs/api" target="docs">
              Amplication docs
            </a>
            <span> to learn more</span>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Login;
