import React, { useCallback } from "react";
import { Button } from "../Components/Button";
import { getAuthorizeURL, getConfig, createState } from "./github-connector";

export const GitHubLoginButton = () => {
  const handleClick = useCallback(() => {
    const { clientID, scope, redirectURI } = getConfig();
    const state = createState();
    const authorizeURL = getAuthorizeURL(clientID, scope, redirectURI, state);
    window.location.href = authorizeURL;
  }, []);

  return (
    <Button onClick={handleClick} type="button">
      Login with GitHub
    </Button>
  );
};
