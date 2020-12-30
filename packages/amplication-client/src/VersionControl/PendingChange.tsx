import React from "react";
import classNames from "classnames";

import * as models from "../models";
import "./PendingChange.scss";

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
    </div>
  );
};

export default PendingChange;
