import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { formatDateAndTime } from "../../util/dateFormat";
import { Tooltip } from "../Tooltip/Tooltip";
import { EnumTextStyle, Text } from "../Text/Text";

const CLASS_NAME = "time-since";

export type Props = {
  time: Date;
};

export function TimeSince({ time }: Props) {
  const formattedTime = useMemo(() => {
    return formatTimeToNow(time);
  }, [time]);

  const fullTime = formatDateAndTime(time, "Never");

  return (
    <span className={CLASS_NAME}>
      <Tooltip className={`${CLASS_NAME}__tooltip`} aria-label={fullTime || ""}>
        <Text textStyle={EnumTextStyle.Subtle}>
          <span className={`${CLASS_NAME}__time`}>{formattedTime}</span>
        </Text>
      </Tooltip>
    </span>
  );
}

function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}
