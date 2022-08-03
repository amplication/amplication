import React from "react";
import { Tooltip } from "@amplication/design-system";
import * as models from "../models";
import "./LockStatusIcon.scss";

type Props = {
  lockedByUser: models.Maybe<models.User> | undefined;
};

function LockStatusIcon({ lockedByUser }: Props) {
  return lockedByUser ? (
    <Tooltip
      aria-label={`Locked by ${lockedByUser.account?.firstName} ${lockedByUser.account?.lastName}`}
    >
      <span className="lock-status-icon" />
    </Tooltip>
  ) : null;
}
export default LockStatusIcon;
