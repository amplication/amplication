import { useCallback } from "react";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
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
      to="https://docs.amplication.com"
      onClick={handleClick}
    />
  );
}

export default DocsTile;
