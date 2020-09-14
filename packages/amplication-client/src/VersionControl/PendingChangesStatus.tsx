import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";

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
            buttonStyle={EnumButtonStyle.Secondary}
            isSplit
            splitValue={pendingChangesContext.pendingChanges.length.toString()}
          >
            Pending
          </Button>
        </NavLink>
      </Tooltip>
    </div>
  );
}

export default PendingChangesStatus;
