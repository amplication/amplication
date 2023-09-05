import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/ui/design-system";

import { GET_TOPICS } from "../Topics/TopicList";
import { useTracking } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type Props = {
  resourceId: string;
};

function TopicsTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { data, loading } = useQuery<{
    Topics: models.Topic[];
  }>(GET_TOPICS, {
    variables: {
      where: { resource: { id: resourceId } },
    },
  });
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
      headerExtra={
        loading ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {data?.Topics.length}
            {data && data?.Topics.length > 1 ? " topics" : " topic"}
          </>
        )
      }
      message="Create topics and define properties."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to topics
        </Button>
      }
    />
  );
}

export { TopicsTile };
