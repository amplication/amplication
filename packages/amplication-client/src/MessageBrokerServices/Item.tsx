import { Button, ConfirmationDialog, EnumButtonStyle } from "@amplication/design-system";
import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { Resource } from "../models";
import "./Item.scss";

type Props = {
  link: string;
  service: Resource;
  onDelete: (service: Resource) => void;
}

const CLASS_NAME = "services-page__list__item";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Disconnect" };
const DISMISS_BUTTON = { label: "Dismiss" };

const description = "See connected services.";

const Item = ({
  link,
  service,
  onDelete
}: Props) => {
  const [confirmDisconnect, setConfirmDisconnect] = useState<boolean>(false);

  const handleDelete = useCallback(event => {
      event.stopPropagation();
      event.preventDefault();
      setConfirmDisconnect(true);
      return false;
    },
    [setConfirmDisconnect]
  );

  const handleDismissDisconnect = useCallback(event => {
    event.stopPropagation();
    event.preventDefault();
    setConfirmDisconnect(false);
  }, [setConfirmDisconnect]);

  const handleConfirmDisconnect = useCallback(event => {
    event.stopPropagation();
    event.preventDefault();
    setConfirmDisconnect(false);
    onDelete(service);
  }, [onDelete, service]);

  return (
    <NavLink to={link}>
      <ConfirmationDialog
        isOpen={confirmDisconnect}
        title={`Disconnect from ${service.name}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to disconnect? "
        onConfirm={handleConfirmDisconnect}
        onDismiss={handleDismissDisconnect}
      />
      <div className={`${CLASS_NAME}`}>
        <div className={`${CLASS_NAME}__header`}>
          <div className={`${CLASS_NAME}__header__title`}>
            {service.name}
          </div>
          <Button
            buttonStyle={EnumButtonStyle.Text}
            icon="trash_2"
            onClick={handleDelete}
          />
        </div>
        <div className={`${CLASS_NAME}__description`}>
          {description}
        </div>
      </div>
    </NavLink>
  );
};

export { Item };
