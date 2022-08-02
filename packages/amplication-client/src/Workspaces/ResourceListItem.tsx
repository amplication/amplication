import React, { useCallback, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { format } from "date-fns";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./ResourceListItem.scss";
import {
  ConfirmationDialog,
  EnumPanelStyle,
  Panel,
  Icon,
  Tooltip,
} from "@amplication/design-system";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

const DATE_FORMAT = "P p";
const CLASS_NAME = "resource-list-item";
const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function ResourceListItem({ resource, onDelete }: Props) {
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { id, name, description } = resource;
  const { trackEvent } = useTracking();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setConfirmDelete(true);
      return false;
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    onDelete && onDelete(resource);
  }, [onDelete, resource]);

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "resourceCardClick",
    });
  }, [trackEvent]);

  const { currentWorkspace, currentProject } = useContext(AppContext);

  const lastBuildDate = resource.builds[0]
    ? new Date(resource.builds[0].createdAt)
    : undefined;
  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${resource.name}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="This action cannot be undone. This will permanently delete the resource and its content. Are you sure you want to continue? "
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      <NavLink to={`/${currentWorkspace?.id}/${currentProject?.id}/${id}`}>
        <Panel
          className={CLASS_NAME}
          clickable
          onClick={handleClick}
          panelStyle={EnumPanelStyle.Bordered}
        >
          <div className={`${CLASS_NAME}__row`}>
            <ResourceCircleBadge type={resource.resourceType} />

            <span className={`${CLASS_NAME}__title`}>{name}</span>

            <span className="spacer" />
            {onDelete && (
              <Button
                buttonStyle={EnumButtonStyle.Text}
                icon="trash_2"
                onClick={handleDelete}
              />
            )}
          </div>
          <div className={`${CLASS_NAME}__row`}>
            <span className={`${CLASS_NAME}__description`}>{description}</span>
          </div>
          <div className={`${CLASS_NAME}__row`}>
            {lastBuildDate && (
              <div className={`${CLASS_NAME}__recently-used`}>
                <Icon icon="clock" />
                <Tooltip
                  aria-label={`Last build: ${format(
                    lastBuildDate,
                    DATE_FORMAT
                  )}`}
                >
                  <span>Last build </span>
                  {format(lastBuildDate, "PP")}
                </Tooltip>
              </div>
            )}
            <span className="spacer" />
          </div>
        </Panel>
      </NavLink>
    </>
  );
}

export default ResourceListItem;
