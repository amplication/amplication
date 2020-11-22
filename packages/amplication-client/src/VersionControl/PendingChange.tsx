import React from "react";
import classNames from "classnames";
import { format } from "date-fns";

import * as models from "../models";

const CLASS_NAME = "pending-change";

type Props = {
  change: models.PendingChange;
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
        {change.action}
      </div>
      <div>{change.resource.displayName}</div>
      <div className={`${CLASS_NAME}__spacer`} />
      <div className={`${CLASS_NAME}__version`}>V{change.versionNumber}</div>
      <div className={`${CLASS_NAME}__time`}>
        {format(new Date(change.resource.updatedAt), "p")}
      </div>
    </div>
  );
};

export default PendingChange;
