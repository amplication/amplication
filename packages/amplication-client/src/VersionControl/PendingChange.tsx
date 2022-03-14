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
            {change.resource.displayName}
          </div>
        </Tooltip>
      );
    }
    if (linkToResource) {
      return <Link to={url}>{change.resource.displayName}</Link>;
    }
    return change.resource.displayName;
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
