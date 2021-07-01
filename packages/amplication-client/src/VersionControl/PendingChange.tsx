import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import * as models from "../models";
import "./PendingChange.scss";

const CLASS_NAME = "pending-change";

type Props = {
  change: models.PendingChange;
  applicationId: string;
  linkToResource?: boolean;
};

const ACTION_TO_LABEL: {
  [key in models.EnumPendingChangeAction]: string;
} = {
  [models.EnumPendingChangeAction.Create]: "C",
  [models.EnumPendingChangeAction.Delete]: "D",
  [models.EnumPendingChangeAction.Update]: "U",
};

const PendingChange = ({
  change,
  applicationId,
  linkToResource = false,
}: Props) => {
  /**@todo: update the url for other types of blocks  */
  const url =
    change.resourceType === models.EnumPendingChangeResourceType.Entity
      ? `/${applicationId}/entities/${change.resourceId}`
      : `/${applicationId}/update`;

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
      <div>
        {linkToResource ? (
          <Link to={url}>{change.resource.displayName}</Link>
        ) : (
          change.resource.displayName
        )}
      </div>
      <div className={`${CLASS_NAME}__spacer`} />
    </div>
  );
};

export default PendingChange;
