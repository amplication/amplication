import React from "react";
import { ReactComponent as MobileImage } from "../assets/images/mobile-message-white.svg";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./MobileMessage.scss";

const CLASS_NAME = "mobile-message";

function MobileMessage() {
  return (
    <div className={CLASS_NAME}>
      <MobileImage />
      <div className={`${CLASS_NAME}__title`}>
        We are working on giving you the best experience
      </div>
      <div className={`${CLASS_NAME}__message`}>
        To work with Amplication, please switch to a computer or a tablet.
      </div>
      <div className={`${CLASS_NAME}__action`}>
        <a href="https://docs.amplication.com">
          <Button buttonStyle={EnumButtonStyle.Primary}>
            Explore Our Docs
          </Button>
        </a>
      </div>
      <div className={`${CLASS_NAME}__action`}>
        or take me to <a href="https://amplication.com">amplication.com</a>
      </div>
    </div>
  );
}

export default MobileMessage;
