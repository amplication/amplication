import React from "react";
import { differenceInMilliseconds } from "date-fns";
import Timer from "react-compound-timer";

import "./ProgressBar.scss";

const CLASS_NAME = "amp-progress-bar";

type Props = {
  message: string;
  startTime: Date;
};

function ProgressBar({ message, startTime }: Props) {
  const initialTime = differenceInMilliseconds(new Date(), new Date(startTime));

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__details`}>
        <div className={`${CLASS_NAME}__message`}>{message}</div>

        <div className={`${CLASS_NAME}__timer`}>
          <Timer initialTime={initialTime}>
            <Timer.Hours formatValue={(value) => (value ? `${value}h ` : "")} />
            <Timer.Minutes />m <Timer.Seconds />s
          </Timer>
        </div>
      </div>
      <div className={`${CLASS_NAME}__progress`} />
    </div>
  );
}

export default ProgressBar;
