import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { isEmpty } from "lodash";

import { Tooltip } from "@primer/components";

import "./PendingChangesStatus.scss";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "pending-changes-status";
const TOOLTIP_DIRECTION = "s";


function PendingChangesStatus({ applicationId }: Props) {
  const pendingChangesContext = useContext(PendingChangesContext);

  return (
    <div className={CLASS_NAME}>
      <Tooltip
        direction={TOOLTIP_DIRECTION}
        noDelay
        wrap
        aria-label={`pending changes`}
      >
        <NavLink to={`/${applicationId}/pending-changes`}>
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            icon="published_with_changes"
          />
          {!isEmpty(pendingChangesContext.pendingChanges) && (
            <div className={`${CLASS_NAME}__counter`}>
              {pendingChangesContext.pendingChanges.length}
            </div>
          )}
        </NavLink>
      </Tooltip>
    </div>
  );
}

export default PendingChangesStatus;
