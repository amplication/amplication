import { Icon } from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { Button, EnumButtonStyle } from "../Components/Button";
import { REACT_APP_GITHUB_CONTROLLER_LOGIN_URL } from "../env";
import "./GitHubLoginButton.scss";
import { AnalyticsEventNames } from "../util/analytics-events.types";

export const GitHubLoginButton = () => {
  return (
    <div>
      <a
        href={
          isEmpty(REACT_APP_GITHUB_CONTROLLER_LOGIN_URL)
            ? "/github"
            : REACT_APP_GITHUB_CONTROLLER_LOGIN_URL
        }
        className="github-login-button"
        hidden
      >
        <Button
          type="button"
          buttonStyle={EnumButtonStyle.Primary}
          eventData={{
            eventName: AnalyticsEventNames.SignInWithGitHub,
          }}
        >
          <Icon icon="github" />
          Continue with GitHub
        </Button>
      </a>

      <a href="http://localhost:3000/auth/login" className="login-button">
        <Button
          type="button"
          buttonStyle={EnumButtonStyle.Primary}
          eventData={{
            eventName: AnalyticsEventNames.SignInWithGitHub,
          }}
        >
          Login
        </Button>
      </a>
    </div>
  );
};
