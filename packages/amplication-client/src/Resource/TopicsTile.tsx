import { useCallback, useContext } from "react";

import { EnumTextColor } from "@amplication/ui/design-system";

import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function TopicsTile({ resourceId }: Props) {
  const { currentWorkspace, currentProject } = useContext(AppContext);

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
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/topics`}
    />
  );
}

export { TopicsTile };
