import { useCallback } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function EntitiesTile({ resourceId }: Props) {
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.EntitiesTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      to={`${baseUrl}/entities`}
      icon="database"
      title="Entities"
      message="Use Amplication's simple and intuitive user interface to
      define your data model."
      onClick={handleClick}
      themeColor={EnumTextColor.ThemePink}
    />
  );
}

export default EntitiesTile;
