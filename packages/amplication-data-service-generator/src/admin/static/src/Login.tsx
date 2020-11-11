import React from "react";
import { Credentials } from "./auth";
import { createBasicAuthorizationHeader } from "./http.util";

export type Props = {
  onLogin: (credentials: Credentials) => void;
};

const Login = ({ onLogin }: Props) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.target as HTMLFormElement;
    // @ts-ignore
    const username = elements.username.value;
    // @ts-ignore
    const password = elements.password.value;
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        if (res.status !== 201) {
          throw new Error(await res.text());
        }
        return res.json();
      })
      .then(() => onLogin({ username, password }));
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" />
      <input name="password" type="password" />
      <input type="submit" />
    </form>
  );
};

export default Login;
