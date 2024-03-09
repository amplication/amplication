import { useCallback, useContext } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function APIsTile({ resourceId }: Props) {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.APIsTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules`}
      icon="api"
      title="APIs"
      message="Manage your application's API. Create and update API endpoints and types."
      onClick={handleClick}
      themeColor={EnumTextColor.ThemeBlue}
    />
  );
}

export default APIsTile;
