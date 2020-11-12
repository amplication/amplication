import React, { useCallback } from "react";
import { Credentials } from "./auth";
import { useAPIMutation } from "./use-api-mutation";

export type Props = {
  onLogin: (credentials: Credentials) => void;
};

interface FormElements extends HTMLCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

const Login = ({ onLogin }: Props) => {
  const [login, { error }] = useAPIMutation<unknown, Credentials>("/login");
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { elements } = event.target as HTMLFormElement & {
        elements: FormElements;
      };
      const username = elements.username.value;
      const password = elements.password.value;
      login({ username, password }).then(() => onLogin({ username, password }));
    },
    [login, onLogin]
  );
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="username" type="text" />
        <input name="password" type="password" />
        <input type="submit" />
      </form>
      <h3>Error</h3>
      {error ? error.toString() : "No Error"}
    </>
  );
};

export default Login;
