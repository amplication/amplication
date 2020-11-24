import React from "react";
import classNames from "classnames";

import * as models from "../models";
import UserAndTime from "../Components/UserAndTime";

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
      <div className={`${CLASS_NAME}__version`}>V{change.versionNumber}</div>
      <div className={`${CLASS_NAME}__spacer`} />
      <UserAndTime
        time={change.resource.updatedAt}
        // Currently Block doesn't implement lockedByUser, remove once it does
        // Either way we currently only get entity here
        // @ts-ignore
        account={change.resource.lockedByUser.account}
      />
    </div>
  );
};

export default PendingChange;
