import React, { useCallback } from "react";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/button/dist/mdc.button.css";
import { LoginCredentials } from "./types";

type Props = {
  onSubmit: (credentials: LoginCredentials) => void;
};

const Login = ({ onSubmit }: Props) => {
  const handleSubmit = useCallback((event) => {
    const { elements } = event.target;
    event.preventDefault();
    event.stopPropagation();
    onSubmit({
      username: elements.username.value,
      password: elements.password.value,
    });
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <TextField name="username" type="text" autoComplete="username" />
      <TextField
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <Button raised>Login</Button>
    </form>
  );
};

export default Login;
