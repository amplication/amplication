import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { useCallback } from "react";
import { Link, LinkProps } from "react-router-dom";
import { Event as TrackEvent, useTracking } from "../util/analytics";
import "./ClickableId.scss";
import { TruncatedId } from "./TruncatedId";

type Props = LinkProps & {
  label?: string;
  id: string;
  eventData?: TrackEvent;
};

export const ClickableId = ({
  to,
  id,
  label,
  eventData,
  className,
  onClick,
  ...rest
}: Props) => {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      if (eventData) {
        trackEvent(eventData);
      }
      if (onClick) {
        onClick(event);
      }
    },
    [onClick, eventData, trackEvent]
  );

  return (
    <span className={classNames("clickable-id", className)}>
      {label && <Text textStyle={EnumTextStyle.Tag}>{label} </Text>}

      <Link {...rest} to={to} onClick={handleClick}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          <TruncatedId id={id} />
        </Text>
      </Link>
    </span>
  );
};
