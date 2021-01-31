import React from "react";
import "./PageContent.scss";
import { Panel } from "@amplication/design-system";
import { ReactComponent as AmplicationLogo } from "../assets/logo-amplication-white.svg";
import { ReactComponent as DiscordButton } from "../assets/images/discord-button.svg";
import "./WelcomePage.scss";

const CLASS_NAME = "welcome-page";

type Props = {
  children: React.ReactNode;
};

/**A stylish full page with a panel in the center used for scenarios like sign in and sign up forms  */
function WelcomePage({ children }: Props) {
  const openSourceMessage = (
    <div className="open-source-message">
      <p>
        amplication is currently in alpha and it should not be used in
        production.
      </p>
      <p>
        amplication is an open-source project and you can send us{" "}
        <a
          target="github"
          href="https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title="
        >
          {" "}
          feature requests
        </a>
        ,{" "}
        <a
          target="github"
          href="https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title="
        >
          {" "}
          bug reports
        </a>
        , and contribute through our{" "}
        <a href="https://github.com/amplication/amplication" target="github">
          {" "}
          GitHub repository
        </a>
        .
      </p>
    </div>
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__stripe`}>
        <a
          href="https://amplication.com"
          className={`${CLASS_NAME}__stripe__logo`}
        >
          <AmplicationLogo />
        </a>
        <div>
          <div className={`${CLASS_NAME}__stripe__title`}>
            Instantly generate quality Node.js apps
          </div>
          <div className={`${CLASS_NAME}__stripe__subtitle`}>
            Just code what matters.
          </div>
          <div className={`${CLASS_NAME}__stripe__open-source-message`}>
            {openSourceMessage}
          </div>
        </div>
        <a
          href="https://discord.gg/b8MrjU6"
          target="discord"
          className="discord-button"
        >
          <DiscordButton />
        </a>
      </div>
      <div className={`${CLASS_NAME}__form`}>
        <Panel className={`${CLASS_NAME}__panel`} shadow>
          {children}
        </Panel>
        <div className={`${CLASS_NAME}__form__open-source-message`}>
          {openSourceMessage}
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
