import {
  EnumTextAlign,
  EnumTextStyle,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React from "react";
import { ReactComponent as DiscordButton } from "../assets/images/discord-button.svg";
import "./PageContent.scss";
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
        Amplication helps you to build and maintain production-ready backend
        services that are always aligned with your standards. <br />
        Leverage Amplication’s live templates to embed your organization’s best
        practices and standards, private plugins to add custom functionality,
        and a comprehensive service catalog to ensure full visibility across all
        services.
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
          href="https://amplication.com/discord"
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
        <Text
          textStyle={EnumTextStyle.Description}
          textAlign={EnumTextAlign.Center}
        >
          By signing up to Amplication, you agree to our <br />
          <Text
            textStyle={EnumTextStyle.Description}
            textAlign={EnumTextAlign.Center}
            underline
          >
            <a href="https://amplication.com/terms" target="terms">
              terms of service
            </a>{" "}
          </Text>
          and&nbsp;
          <Text
            textStyle={EnumTextStyle.Description}
            textAlign={EnumTextAlign.Center}
            underline
          >
            <a href="https://amplication.com/privacy-policy" target="privacy">
              privacy policy
            </a>
          </Text>
          .
        </Text>
      </div>
    </div>
  );
}

export default WelcomePage;
