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

function ServicesTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.MessageBrokerConnectedServicesTileClick,
    });
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/services`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="services_outline"
      title="Services"
      message="Connect services to the message broker for event-driven architecture."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          type="button"
          onClick={handleClick}
          style={{ minWidth: "140px" }}
        >
          Connect Services
        </Button>
      }
    />
  );
}

export { ServicesTile };
