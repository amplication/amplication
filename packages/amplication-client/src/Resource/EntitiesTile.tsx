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

function EntitiesTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.EntitiesTileClick });
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="database"
      title="Entities"
      message="Use Amplication's simple and intuitive user interface to define your data model."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to entities
        </Button>
      }
    />
  );
}

export default EntitiesTile;
