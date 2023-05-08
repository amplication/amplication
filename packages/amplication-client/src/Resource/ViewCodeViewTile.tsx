import React, { useCallback, useContext } from "react";

import { Button, EnumButtonStyle } from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type Props = {
  resourceId: string;
};

function ViewCodeViewTile({ resourceId }: Props) {
  const { trackEvent } = useTracking();
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const handleClick = useCallback(() => {
    trackEvent({ eventName: AnalyticsEventNames.CodeViewTileClick });
    history.push(`/${currentWorkspace?.id}/${currentProject?.id}/code-view`);
  }, [history, trackEvent, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="code"
      title="Code View"
      message="Amplication generates the code automatically. You can use the 'Code View' page to view and explore the generated code."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          View code
        </Button>
      }
    />
  );
}

export default ViewCodeViewTile;
