import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "@rmwc/snackbar/styles";

import { Panel, EnumPanelStyle } from "../Components/Panel";

import "./PendingChangesTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import commitImage from "../assets/images/commits.svg";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "pending-changes-tile";

function PendingChangesTile({ applicationId }: Props) {
  const pendingChangesContext = useContext(PendingChangesContext);

  return (
    <Panel className={`${CLASS_NAME}`} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__content`}>
        <img src={commitImage} alt="publish" />
        <div className={`${CLASS_NAME}__content__details`}>
          {pendingChangesContext.pendingChanges.length === 0 ? (
            <h2>There are no pending changes</h2>
          ) : (
            <>
              <h2>
                Pending Changes
                <span className="pending-changes">
                  {pendingChangesContext.pendingChanges.length}
                </span>
              </h2>
            </>
          )}
        </div>
        <Link to={`/${applicationId}/pending-changes`}>
          <Button buttonStyle={EnumButtonStyle.Secondary}>View All</Button>
        </Link>
      </div>
    </Panel>
  );
}

export default PendingChangesTile;
