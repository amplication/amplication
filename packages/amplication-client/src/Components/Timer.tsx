import React, { useMemo } from "react";
import { differenceInMilliseconds } from "date-fns";
import TimerComponent from "@amplication/react-compound-timer";

const CLASS_NAME = "amp-timer";
const EMPTY_TIMER = "0m 0s";

type Props = {
  runTimer: boolean;
  startTime: Date;
  endTime?: Date;
};

function Timer({ startTime, endTime, runTimer }: Props) {
  const initialTime = useMemo(() => {
    const endDate = endTime ? new Date(endTime) : new Date();
    return differenceInMilliseconds(endDate, new Date(startTime));
  }, [startTime, endTime]);

  const startImmediately = !endTime && runTimer;

  // use a unique key to force re-render of Timer when startTime or endTime change
  const timerKey =
    (startTime ? startTime.toString() : "") +
    (endTime ? endTime.toString() : "");

  return (
    <span className={`${CLASS_NAME}`}>
      {!startTime ? (
        EMPTY_TIMER
      ) : (
        <TimerComponent
          key={timerKey}
          initialTime={initialTime}
          startImmediately={startImmediately}
        >
          <TimerComponent.Hours
            formatValue={(value) => (value ? `${value}h ` : "")}
          />
          <TimerComponent.Minutes />m <TimerComponent.Seconds />s
        </TimerComponent>
      )}
    </span>
  );
}
export default Timer;
