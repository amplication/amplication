import React, { useCallback, useContext, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./ResourceListItem.scss";
import {
  ConfirmationDialog,
  EnumHorizontalRuleStyle,
  EnumPanelStyle,
  HorizontalRule,
  Icon,
  Panel,
  UserAndTime,
} from "@amplication/design-system";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { AppContext } from "../context/appContext";
import classNames from "classnames";
import EllipsisText from "../Components/EllipsisText";
import useTextOffsetHeight from "../util/useTextOffsetHeight";

type Props = {
  resource: models.Resource;
  onDelete?: (resource: models.Resource) => void;
};

const CLASS_NAME = "resource-list-item";
const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };
const LINE_HEIGHT = 35;

function ResourceListItem({ resource, onDelete }: Props) {
  const { currentWorkspace, currentProject, setResource } =
    useContext(AppContext);
  const { id, name, description, gitRepository } = resource;
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const headerRowRef = useRef(null);
  const isTitleOverflow = useTextOffsetHeight(headerRowRef, LINE_HEIGHT);

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

  const gitHubRepo = gitRepository
    ? `${gitRepository.gitOrganization.name}/${gitRepository.name}`
    : undefined;

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${resource.name}' ?`}
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
          <div
            ref={headerRowRef}
            className={`${CLASS_NAME}__row`}
            style={{ alignItems: isTitleOverflow ? "flex-start" : "center" }}
          >
            <ResourceCircleBadge type={resource.resourceType} />

            <EllipsisText className={`${CLASS_NAME}__title`} text={name} />

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
            <EllipsisText
              className={`${CLASS_NAME}__description`}
              text={description}
              maxLength={350}
            />
          </div>
          <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
          <div className={`${CLASS_NAME}__row`}>
            <div className={`${CLASS_NAME}__github`}>
              <span
                className={classNames(`${CLASS_NAME}__github-repo`, {
                  [`${CLASS_NAME}__github-repo--not-connected`]: !gitHubRepo,
                })}
              >
                <Icon
                  icon="github"
                  size="small"
                  className={`${CLASS_NAME}__github-repo__icon${
                    !gitHubRepo ? "-not-connected" : ""
                  }`}
                />
                <span>{gitHubRepo ? gitHubRepo : "Not connected"}</span>
              </span>
            </div>
            <span className="spacer" />
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
          </div>
        </Panel>
      </NavLink>
    </>
  );
}

export default ResourceListItem;
