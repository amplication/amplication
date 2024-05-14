import React from "react";
import Timer from "./Timer";
import "./ProgressBar.scss";

const CLASS_NAME = "amp-progress-bar";

type Props = {
  message?: string;
  startTime?: Date;
};

function ProgressBar({ message, startTime }: Props) {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__details`}>
        <div className={`${CLASS_NAME}__message`}>{message}</div>
        {startTime && (
          <div className={`${CLASS_NAME}__timer`}>
            <Timer startTime={startTime} runTimer />
          </div>
        )}
      </div>
      <div className={`${CLASS_NAME}__progress`} />
    </div>
  );
}

export default ProgressBar;
