import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import "@rmwc/snackbar/styles";
import { isEmpty } from "lodash";
import { Panel, EnumPanelStyle, PanelHeader } from "@amplication/design-system";

import "./PendingChangesTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import imageChanges from "../assets/images/tile-changes.svg";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { useTracking, Event as TrackEvent } from "../util/analytics";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "pending-changes-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "pendingChangesTileClick",
};

function PendingChangesTile({ applicationId }: Props) {
  const history = useHistory();
  const pendingChangesContext = useContext(PendingChangesContext);

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/pending-changes`);
    },
    [history, trackEvent, applicationId]
  );

  return (
    <Panel
      className={`${CLASS_NAME}`}
      panelStyle={EnumPanelStyle.Bordered}
      clickable
      onClick={handleClick}
    >
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>Pending Changes</h2>
          {isEmpty(pendingChangesContext.pendingChanges) ? (
            <>You have no pending changes</>
          ) : (
            <>
              You have {pendingChangesContext.pendingChanges.length} pending
              {pendingChangesContext.pendingChanges.length > 1
                ? " changes"
                : " change"}
            </>
          )}
          <Button
            className={`${CLASS_NAME}__content__action`}
            buttonStyle={EnumButtonStyle.Secondary}
          >
            View Changes
          </Button>
        </div>
        <img src={imageChanges} alt="publish" />
      </div>
    </Panel>
  );
}

export default PendingChangesTile;
