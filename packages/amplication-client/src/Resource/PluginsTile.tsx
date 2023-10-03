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

function PluginsTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.PluginsTileClick });
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/plugins`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="plugins"
      title="Plugins"
      message="Extend and customize your services by using plugins for various technologies and integrations"
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          type="button"
          onClick={handleClick}
          style={{ minWidth: "140px" }}
        >
          Go to Plugins
        </Button>
      }
    />
  );
}

export default PluginsTile;
