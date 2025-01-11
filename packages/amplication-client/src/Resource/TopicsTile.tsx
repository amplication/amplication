import { useCallback } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function TopicsTile({ resourceId }: Props) {
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.MessageBrokerTopicsTileClick });
  }, [trackEvent]);

  return (
    <OverviewSecondaryTile
      icon="topics_outline"
      title="Topics"
      message="Create topics to send and receive messages between services."
      onClick={handleClick}
      themeColor={EnumTextColor.ThemeBlue}
      to={`${baseUrl}/topics`}
    />
  );
}

export { TopicsTile };
