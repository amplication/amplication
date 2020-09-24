import React from "react";
import "./DetectScreenResolution.scss";
import { isMobile } from "react-device-detect";
import useWindowSize from "@rooks/use-window-size";
import classNames from "classnames";

const CLASS_NAME = "detect-screen-resolution";
const MIN_WIDTH = 900;

function DetectScreenResolution() {
  const { innerWidth } = useWindowSize();

  if (!innerWidth || innerWidth > MIN_WIDTH) return null;

  return (
    <div
      className={classNames(CLASS_NAME, {
        "detect-screen-resolution--mobile": isMobile,
      })}
    >
      <h1 className={`${CLASS_NAME}__title`}>Your resolution is too small </h1>
      <div className={`${CLASS_NAME}__message`}>
        {isMobile ? (
          <>To enjoy Amplication please open it from a computer.</>
        ) : (
          <>
            To enjoy Amplication resize your browser to be at least {MIN_WIDTH}
            px wide.
          </>
        )}
      </div>
    </div>
  );
}

export default DetectScreenResolution;
