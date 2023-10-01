import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";

import { Button, EnumButtonStyle } from "@amplication/ui/design-system";

import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import OverviewSecondaryTile from "./OverviewSecondaryTile";

type Props = {
  resourceId: string;
};

function TopicsTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.MessageBrokerTopicsTileClick });
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/topics`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="topics_outline"
      title="Topics"
      message="Create topics to send and receive messages between services."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          type="button"
          onClick={handleClick}
          style={{ minWidth: "140px" }}
        >
          Go to Topics
        </Button>
      }
    />
  );
}

export { TopicsTile };
