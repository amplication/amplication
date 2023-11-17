import React from "react";
import "./ScreenResolutionMessage.scss";
import { isMobile } from "react-device-detect";
import { useWindowSize } from "rooks";
import classNames from "classnames";
import { ReactComponent as MobileImage } from "../assets/images/mobile-message-white.svg";

const CLASS_NAME = "screen-resolution-message";
const MIN_WIDTH = 900;

function ScreenResolutionMessage() {
  const { innerWidth } = useWindowSize();

  if (!innerWidth || innerWidth > MIN_WIDTH) return null;

  return (
    <div
      className={classNames(CLASS_NAME, {
        "screen-resolution-message--mobile": isMobile,
      })}
    >
      <MobileImage />
      <div className={`${CLASS_NAME}__title`}>
        Your resolution is too small{" "}
      </div>
      <div className={`${CLASS_NAME}__message`}>
        {isMobile ? (
          <>To enjoy Amplication please open it from a computer.</>
        ) : (
          <>
            To enjoy Amplication resize your browser to be at least {MIN_WIDTH}
            px&nbsp;wide.
          </>
        )}
      </div>
    </div>
  );
}

export default ScreenResolutionMessage;
