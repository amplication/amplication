import { useCallback } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  resourceId: string;
};

function ServicesTile({ resourceId }: Props) {
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

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
      to={`${baseUrl}/services`}
    />
  );
}

export { ServicesTile };
