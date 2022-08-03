import React from "react";
import { Tooltip } from "@amplication/design-system";
import classNames from "classnames";
import { Link } from "react-router-dom";

import * as models from "../models";
import "./PendingChange.scss";

const CLASS_NAME = "pending-change";
const TOOLTIP_DIRECTION = "ne";

type Props = {
  change: models.PendingChange;
  applicationId: string;
  linkToOrigin?: boolean;
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
  linkToOrigin = false,
}: Props) => {
  /**@todo: update the url for other types of blocks  */
  const url =
    change.originType === models.EnumPendingChangeOriginType.Entity
      ? `/${applicationId}/entities/${change.originId}`
      : `/${applicationId}/update`;

  const isDeletedEntity =
    change.action === models.EnumPendingChangeAction.Delete;

  const getEntityHeading = () => {
    if (isDeletedEntity) {
      return (
        <Tooltip
          wrap
          direction={TOOLTIP_DIRECTION}
          aria-label="The entity has been deleted"
          className={`${CLASS_NAME}__tooltip_deleted`}
        >
          <div className={classNames(`${CLASS_NAME}__deleted`)}>
            {change.origin.displayName}
          </div>
        </Tooltip>
      );
    }
    if (linkToOrigin) {
      return <Link to={url}>{change.origin.displayName}</Link>;
    }
    return change.origin.displayName;
  };

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
      {getEntityHeading()}
      <div className={`${CLASS_NAME}__spacer`} />
    </div>
  );
};

export default PendingChange;
