import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { format } from "date-fns";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./ApplicationListItem.scss";
import { BuildStatusIcons } from "../VersionControl/BuildStatusIcons";
import {
  ConfirmationDialog,
  CircleBadge,
  EnumPanelStyle,
  Panel,
  Icon,
  Tooltip,
} from "@amplication/design-system";

type Props = {
  app: models.App;
  onDelete: (app: models.App) => void;
};

const DATE_FORMAT = "P p";
const CLASS_NAME = "application-list-item";
const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function ApplicationListItem({ app, onDelete }: Props) {
  const { id, name, description, color } = app;
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
    onDelete(app);
  }, [onDelete, app]);

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "applicationCardClick",
    });
  }, [trackEvent]);

  const lastBuildDate = app.builds[0]
    ? new Date(app.builds[0].createdAt)
    : undefined;
  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${app.name}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="This action cannot be undone. This will permanently delete the app and its content. Are you sure you want to continue? "
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
            <CircleBadge name={name} color={color} />

            <span className={`${CLASS_NAME}__title`}>{name}</span>

            <span className="spacer" />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="trash_2"
              onClick={handleDelete}
            />
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
            <BuildStatusIcons build={app.builds[0]} />
            <span className="spacer" />
          </div>
        </Panel>
      </NavLink>
    </>
  );
}

export default ApplicationListItem;
