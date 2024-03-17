import { useCallback, useContext } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function ServicesTile({ resourceId }: Props) {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.MessageBrokerConnectedServicesTileClick,
    });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      icon="services_outline"
      title="Services"
      message="Connect services to the message broker for event-driven architecture."
      onClick={handleClick}
      themeColor={EnumTextColor.ThemePink}
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/services`}
    />
  );
}

export { ServicesTile };
