import { Button, EnumButtonStyle } from "../Components/Button";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./LoginButton.scss";

export const EnterpriseLoginButton = () => {
  return (
    <a href="http://localhost:3000/auth/login" className="login-button">
      <Button
        type="button"
        buttonStyle={EnumButtonStyle.Secondary}
        eventData={{
          eventName: AnalyticsEventNames.SignInWithGitHub,
        }}
      >
        Continue with SSO
      </Button>
    </a>
  );
};
