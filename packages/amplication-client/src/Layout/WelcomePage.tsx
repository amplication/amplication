import React from "react";
import { isEmpty } from "lodash";
import "./PageContent.scss";
import { Panel } from "@amplication/design-system";
import { ReactComponent as DiscordButton } from "../assets/images/discord-button.svg";
import "./WelcomePage.scss";

const CLASS_NAME = "welcome-page";

export type PageContent = {
  name: string;
  title: string;
  subTitle: string;
  message: string;
  logo: string;
};
type Props = PageContent & {
  children: React.ReactNode;
};

/**A stylish full page with a panel in the center used for scenarios like sign in and sign up forms  */
function WelcomePage({
  children,
  name,
  title,
  subTitle,
  message,
  logo,
}: Props) {
  const openSourceMessage = (
    <div className="open-source-message">
      <p>
        {!isEmpty(message) && (
          <div className={`${CLASS_NAME}__source-title`}>{message}</div>
        )}
        Amplication is currently in Beta however your generated apps are
        production-ready. Every app generated using Amplication platform
        contains popular, documented, secured, and supported production-ready
        open-source components & packages. Read more about our stack{" "}
        <a
          href="https://docs.amplication.com/docs/getting-started"
          target="docs"
        >
          here
        </a>
        .
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
          <img src={logo} alt="logo" />
        </a>
        <div>
          <div className={`${CLASS_NAME}__stripe__title`}>{title}</div>
          <div className={`${CLASS_NAME}__stripe__subtitle`}>{subTitle}</div>
          <div className={`${CLASS_NAME}__stripe__open-source-message`}>
            {openSourceMessage}
          </div>
        </div>
        <a
          href="https://discord.gg/Z2CG3rUFnu"
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
