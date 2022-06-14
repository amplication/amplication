import React, { useCallback } from "react";

import { Button, EnumButtonStyle } from "@amplication/design-system";

import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

const EVENT_DATA: TrackEvent = {
  eventName: "featureRequestTileClick",
};

function FeatureRequestTile() {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
    },
    [trackEvent]
  );

  return (
    <OverviewSecondaryTile
      icon="main_logo"
      title="Submit a feature request"
      message="If there’s something you’d like to see in Amplication, open a Feature Request on GitHub and tell us about it."
      footer={
        <a
          href="https://github.com/amplication/amplication/issues/new/choose"
          target="githubfeature"
          rel="noopener"
          onClick={handleClick}
        >
          <Button buttonStyle={EnumButtonStyle.Secondary} type="button">
            Share your idea
          </Button>
        </a>
      }
    />
  );
}

export default FeatureRequestTile;
