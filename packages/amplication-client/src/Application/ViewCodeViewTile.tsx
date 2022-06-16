import React, { useCallback } from "react";

import { Button, EnumButtonStyle } from "@amplication/design-system";

import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { useHistory } from "react-router-dom";

const EVENT_DATA: TrackEvent = {
  eventName: "viewCodeViewTileClick",
};

type Props = {
  applicationId: string;
};
function ViewCodeViewTile({ applicationId }: Props) {
  const { trackEvent } = useTracking();
  const history = useHistory();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/code-view`);
    },
    [history, trackEvent, applicationId]
  );

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
