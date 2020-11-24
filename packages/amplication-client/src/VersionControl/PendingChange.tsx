import React from "react";
import classNames from "classnames";
import TimeSince, { EnumTimeSinceSize } from "../Components/TimeSince";

import * as models from "../models";

const CLASS_NAME = "pending-change";

type Props = {
  change: models.PendingChange;
};

const ACTION_TO_LABEL: {
  [key in models.EnumPendingChangeAction]: string;
} = {
  [models.EnumPendingChangeAction.Create]: "C",
  [models.EnumPendingChangeAction.Delete]: "D",
  [models.EnumPendingChangeAction.Update]: "U",
};

const PendingChange = ({ change }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div
        className={classNames(
          `${CLASS_NAME}__action`,
          change.action.toLowerCase()
        )}
      >
        {ACTION_TO_LABEL[change.action]}
      </div>
      <div>{change.resource.displayName}</div>
      <div className={`${CLASS_NAME}__spacer`} />
      <div className={`${CLASS_NAME}__version`}>V{change.versionNumber}</div>
      <TimeSince
        time={change.resource.updatedAt}
        size={EnumTimeSinceSize.short}
      />
    </div>
  );
};

export default PendingChange;
