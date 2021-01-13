import React from "react";
import { Icon } from "@rmwc/icon";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./GitHubLoginButton.scss";

export const GitHubLoginButton = () => {
  return (
    <a href="http://localhost:3000/github" className="github-login-button">
      <Button
        type="button"
        buttonStyle={EnumButtonStyle.CallToAction}
        eventData={{
          eventName: "signInWithGitHub",
        }}
      >
        <Icon icon="github" />
        Continue with GitHub
      </Button>
    </a>
  );
};
