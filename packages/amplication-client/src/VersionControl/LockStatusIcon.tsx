import React from "react";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import "./LockStatusIcon.scss";

type Props = {
  enabled?: boolean;
};

function LockStatusIcon({ enabled }: Props) {
  return (
    <Icon
      className={classNames("lock-status-icon", {
        "lock-status-icon--enabled": enabled,
      })}
      icon="Pending_changes"
    />
  );
}
export default LockStatusIcon;
