import React from "react";
import "./PageContent.scss";
import { Panel } from "../Components/Panel";
import { ReactComponent as AmplicationLogo } from "../assets/logo-amplication.svg";
import "./WelcomePage.scss";

const CLASS_NAME = "welcome-page";

type Props = {
  children: React.ReactNode;
};

/**A stylish full page with a panel in the center used for scenarios like sign in and sign up forms  */
function WelcomePage({ children }: Props) {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__stripe`}>
        <AmplicationLogo />
      </div>
      <div className={`${CLASS_NAME}__form`}>
        <Panel className={`${CLASS_NAME}__panel`} shadow>
          {children}
        </Panel>
      </div>
    </div>
  );
}

export default WelcomePage;
