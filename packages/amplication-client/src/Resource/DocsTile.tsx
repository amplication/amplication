import React, { useCallback } from "react";

import { Button, EnumButtonStyle } from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AnalyticsEventNames } from "../util/analytics-events.types";
function DocsTile() {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.DocsTileClick });
  }, [trackEvent]);

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
