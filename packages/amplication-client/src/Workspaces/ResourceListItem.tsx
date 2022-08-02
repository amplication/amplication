import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./ResourceListItem.scss";
import {
  ConfirmationDialog,
  EnumPanelStyle,
  UserAndTime,
  Panel,
  HorizontalRule,
  EnumHorizontalRuleStyle,
} from "@amplication/design-system";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

const CLASS_NAME = "resource-list-item";
const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function ResourceListItem({ resource, onDelete }: Props) {
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

  const lastBuild = resource.builds[0];

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
      <NavLink to={`/${id}`}>
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
          <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
          <div className={`${CLASS_NAME}__row`}>
            <div className={`${CLASS_NAME}__recently-used`}>
              <span>Last build </span>
              {lastBuild && (
                <UserAndTime
                  account={lastBuild.commit.user?.account || {}}
                  time={lastBuild.createdAt}
                />
              )}
            </div>

            <span className="spacer" />
          </div>
        </Panel>
      </NavLink>
    </>
  );
}

export default ResourceListItem;
