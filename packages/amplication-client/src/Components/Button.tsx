import React, { useCallback } from "react";
import * as designSystem from "@amplication/ui/design-system";
import { useTracking, Event as TrackEvent } from "../util/analytics";

export { EnumButtonStyle } from "@amplication/ui/design-system";

export type Props = designSystem.ButtonProps & {
  eventData?: TrackEvent;
};

export const Button = ({ eventData, onClick, ...rest }: Props) => {
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

  return <designSystem.Button {...rest} onClick={handleClick} />;
};
