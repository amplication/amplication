import React, { useCallback } from "react";
import { Button } from "../Components/Button";
import { getAuthorizeURL, getConfig } from "./github-connector";

export const GitHubLoginButton = () => {
  const handleClick = useCallback(() => {
    const { clientID, scope, redirectURI } = getConfig();
    const authorizeURL = getAuthorizeURL(clientID, scope, redirectURI);
    window.location.href = authorizeURL;
  }, []);

  return (
    <Button onClick={handleClick} type="button">
      Login with GitHub
    </Button>
  );
};
