import { useCallback } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function APIsTile({ resourceId }: Props) {
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.APIsTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      to={`${baseUrl}/modules`}
      icon="api"
      title="APIs"
      message="Manage your application's API. Create and update API endpoints and types."
      onClick={handleClick}
      themeColor={EnumTextColor.ThemeBlue}
    />
  );
}

export default APIsTile;
