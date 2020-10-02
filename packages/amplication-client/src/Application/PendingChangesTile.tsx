import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "@rmwc/snackbar/styles";
import { isEmpty } from "lodash";
import { Panel, EnumPanelStyle, PanelHeader } from "../Components/Panel";

import "./PendingChangesTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import imageChanges from "../assets/images/tile-changes.svg";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "pending-changes-tile";

function PendingChangesTile({ applicationId }: Props) {
  const pendingChangesContext = useContext(PendingChangesContext);

  return (
    <Panel className={`${CLASS_NAME}`} panelStyle={EnumPanelStyle.Bordered}>
      <PanelHeader className={`${CLASS_NAME}__title`}>
        <h2>Pending Changes</h2>
      </PanelHeader>
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
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
        </div>
        <img src={imageChanges} alt="publish" />
        <Link
          to={`/${applicationId}/pending-changes`}
          className={`${CLASS_NAME}__content__action`}
        >
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            eventData={{
              eventName: "pendingChangesTileClick",
            }}
          >
            View Pending Changes
          </Button>
        </Link>
      </div>
    </Panel>
  );
}

export default PendingChangesTile;
