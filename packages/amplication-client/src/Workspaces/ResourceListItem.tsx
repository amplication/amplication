import React, { useCallback, useContext, useState } from "react";
import { NavLink } from "react-router-dom";

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
import { AppContext } from "../context/appContext";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

const CLASS_NAME = "resource-list-item";
const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function ResourceListItem({ resource, onDelete }: Props) {
  const { currentWorkspace, currentProject, setResource } = useContext(
    AppContext
  );
  const { id, name, description } = resource;
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
    setResource(resource);
  }, [resource, setResource]);

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
          {resource.resourceType !==
            models.EnumResourceType.ProjectConfiguration && (
            <>
              <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
              <div className={`${CLASS_NAME}__row`}>
                <div className={`${CLASS_NAME}__recently-used`}>
                  <span className={`${CLASS_NAME}__last-build`}>
                    <span className={`${CLASS_NAME}__last-build__title`}>
                      Last commit:{" "}
                    </span>
                    {lastBuild ? (
                      <UserAndTime
                        account={lastBuild.commit.user?.account || {}}
                        time={lastBuild.createdAt}
                      />
                    ) : (
                      <span className={`${CLASS_NAME}__last-build__not-yet`}>
                        No commit yet
                      </span>
                    )}
                  </span>
                </div>

                <span className="spacer" />
              </div>
            </>
          )}
        </Panel>
      </NavLink>
    </>
  );
}

export default ResourceListItem;
