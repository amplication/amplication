import React from "react";
import "./PageContent.scss";
import { Panel } from "@amplication/design-system";
import { ReactComponent as AmplicationLogo } from "../assets/logo-amplication.svg";
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

      <p>
        You may also chat with us on our{" "}
        <a href="https://discord.gg/b8MrjU6" target="discord">
          Discord server
        </a>
        .
      </p>
    </div>
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__stripe`}>
        <div>
          <a href="https://amplication.com">
            <AmplicationLogo />
          </a>
          <div className={`${CLASS_NAME}__stripe__title`}>
            Developer oriented
            <br />
            <span>Open source</span>
            <br />
            Low-code Platform
          </div>
          <div className={`${CLASS_NAME}__stripe__open-source-message`}>
            {openSourceMessage}
          </div>
        </div>
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
