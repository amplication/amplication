import React, { useContext } from "react";
import { Tooltip } from "@amplication/design-system";
import classNames from "classnames";
import { Link } from "react-router-dom";

import * as models from "../models";
import "./PendingChange.scss";
import { AppContext } from "../context/appContext";

const CLASS_NAME = "pending-change";
const TOOLTIP_DIRECTION = "ne";

type Props = {
  change: models.PendingChange;
  linkToOrigin?: boolean;
};

const ACTION_TO_LABEL: {
  [key in models.EnumPendingChangeAction]: string;
} = {
  [models.EnumPendingChangeAction.Create]: "C",
  [models.EnumPendingChangeAction.Delete]: "D",
  [models.EnumPendingChangeAction.Update]: "U",
};

const PendingChange = ({ change, linkToOrigin = false }: Props) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);
  /**@todo: update the url for other types of blocks  */
  const url =
    change.originType === models.EnumPendingChangeOriginType.Entity
      ? `/${currentWorkspace?.id}/${currentProject?.id}/${change.resource.id}/entities/${change.originId}`
      : `/${currentWorkspace?.id}/${currentProject?.id}/${change.resource.id}/update`;

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
      return (
        <Link to={url} className={`${CLASS_NAME}__link`}>
          {change.origin.displayName}
        </Link>
      );
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
