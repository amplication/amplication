import React, { useCallback } from "react";

import { Button, EnumButtonStyle } from "@amplication/design-system";

import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

const EVENT_DATA: TrackEvent = {
  eventName: "viewRoadmapTileClick",
};

function ViewRoadmapTile() {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
    },
    [trackEvent]
  );

  return (
    <OverviewSecondaryTile
      icon="code"
      title="Code View"
      message="We continuously add new features to Amplication. Soon you’ll be able to access the generated code within the Amplication Console."
      footer={
        <a
          href="https://docs.amplication.com/docs/about/roadmap"
          target="viewroadmap"
          rel="noopener"
          onClick={handleClick}
        >
          <Button buttonStyle={EnumButtonStyle.Outline} type="button">
            View roadmap
          </Button>
        </a>
      }
      showComingSoon
    />
  );
}

export default ViewRoadmapTile;
