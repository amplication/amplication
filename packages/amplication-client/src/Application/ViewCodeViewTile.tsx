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
      message="We continuously add new features to Amplication. Soon you’ll be able to access the generated code within the Amplication Console."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Watch code
        </Button>
      }
    />
  );
}

export default ViewCodeViewTile;
