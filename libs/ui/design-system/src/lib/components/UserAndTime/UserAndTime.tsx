import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import "skeleton-screen-css";
import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { EnumTextColor, EnumTextStyle, Text } from "../Text/Text";
import { Tooltip } from "../Tooltip/Tooltip";
import "./UserAndTime.scss";

export type Props = {
  account?: { firstName?: string; lastName?: string };
  time: Date;
  label?: string;
  emptyText?: string;
  valueColor?: EnumTextColor;
};

const DIRECTION_UP = "n";
const DIRECTION_DOWN = "s";
const DIRECTION_THRESHOLD = 100;
const NEVER = "never";
const CLASS_NAME = "amp-user-and-time";
type DirectionType = "n" | "s";

export function UserAndTime({
  account,
  time,
  label,
  emptyText = NEVER,
  valueColor = EnumTextColor.White,
}: Props) {
  const [tooltipDirection, setTooltipDirection] =
    useState<DirectionType>(DIRECTION_DOWN);

  const { firstName, lastName } = account || {};

  const formattedTime = useMemo(() => {
    return formatTimeToNow(time);
  }, [time]);

  const changeTooltipDirection = (pageY: number) =>
    setTooltipDirection(
      pageY < DIRECTION_THRESHOLD ? DIRECTION_DOWN : DIRECTION_UP
    );

  return (
    <FlexItem
      gap={EnumGapSize.Small}
      className={CLASS_NAME}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
    >
      {label && <Text textStyle={EnumTextStyle.Subtle}>{label}</Text>}
      {formattedTime ? (
        <Text textStyle={EnumTextStyle.Subtle} textColor={valueColor}>
          <Tooltip
            aria-label={`${firstName} ${lastName}`}
            direction={tooltipDirection}
            noDelay
          >
            <span onMouseOver={(e) => changeTooltipDirection(e.pageY)}>
              {formattedTime}
            </span>
          </Tooltip>
        </Text>
      ) : (
        <Text textStyle={EnumTextStyle.Subtle} textColor={valueColor}>
          {emptyText}
        </Text>
      )}
    </FlexItem>
  );
}

export function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}
