import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import { Button } from "@mui/material";
import "./login.scss";

const LoginForm = ({ theme }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();
  const BASE_URI = process.env.REACT_APP_SERVER_URL;
  const submit = (e: any) => {
    e.preventDefault();
    login({ username, password }).catch(() =>
      notify("Invalid username or password")
    );
  };

  return (
    <form onSubmit={submit}>
      <label>
        <span>Username</span>

        <input
          name="username"
          type="textbox"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        <span>Password</span>

        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <Button type="submit" variant="contained" color="primary">
        Log in
      </Button>
    </form>
  );
};

export default LoginForm;
