import React, { useCallback } from "react";

import { Button, EnumButtonStyle } from "@amplication/design-system";

import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

const EVENT_DATA: TrackEvent = {
  eventName: "docsTileClick",
};

function DocsTile() {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
    },
    [trackEvent]
  );

  return (
    <OverviewSecondaryTile
      icon="file_text"
      title="Read the Docs"
      message="When in doubt, read the docs. You’ll become an expert in no time."
      footer={
        <a
          href="https://docs.amplication.com"
          target="docs"
          rel="noopener"
          onClick={handleClick}
        >
          <Button buttonStyle={EnumButtonStyle.Secondary} type="button">
            Go to docs
          </Button>
        </a>
      }
    />
  );
}

export default DocsTile;
