import { useCallback, useContext } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function EntitiesTile({ resourceId }: Props) {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.EntitiesTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities`}
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
