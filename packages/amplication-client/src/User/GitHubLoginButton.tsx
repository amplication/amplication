import React from "react";
import { Button } from "../Components/Button";

const {
  REACT_APP_GITHUB_CLIENT_ID,
  REACT_APP_GITHUB_SCOPE,
  REACT_APP_GITHUB_REDIRECT_URI,
} = process.env;

export const githubClientId = REACT_APP_GITHUB_CLIENT_ID;

export const GitHubLoginButton = () => {
  // @ts-ignore
  const params = new URLSearchParams({
    client_id: REACT_APP_GITHUB_CLIENT_ID,
    scope: REACT_APP_GITHUB_SCOPE,
    redirect_uri: REACT_APP_GITHUB_REDIRECT_URI,
  });

  return (
    <a href={`https://github.com/login/oauth/authorize?${params}`}>
      <Button type="button">Login with GitHub</Button>
    </a>
  );
};
