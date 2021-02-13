import React from "react";
import { Tooltip } from "@primer/components";
import * as models from "../models";
import "./LockStatusIcon.scss";

type Props = {
  lockedByUser: models.User;
};

function LockStatusIcon({ lockedByUser }: Props) {
  return (
    <Tooltip
      aria-label={`Locked by ${lockedByUser.account?.firstName} ${lockedByUser.account?.lastName}`}
    >
      <span className="lock-status-icon" />
    </Tooltip>
  );
}
export default LockStatusIcon;
