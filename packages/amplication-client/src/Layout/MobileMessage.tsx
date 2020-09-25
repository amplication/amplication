import React from "react";
import { ReactComponent as MobileImage } from "../assets/images/mobile-message.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";

import "./MobileMessage.scss";

const CLASS_NAME = "mobile-message";

function MobileMessage() {
  return (
    <div className={CLASS_NAME}>
      <a href="https://amplication.com">
        <Logo className={`${CLASS_NAME}__logo`} />
      </a>
      <MobileImage />
      <div className={`${CLASS_NAME}__title`}>Please note</div>
      <div className={`${CLASS_NAME}__message`}>
        To enjoy Amplication please open it from a computer.
      </div>
    </div>
  );
}

export default MobileMessage;
