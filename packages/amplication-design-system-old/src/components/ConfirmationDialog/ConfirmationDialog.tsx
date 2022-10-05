import React from "react";
import { Dialog } from "../Dialog/Dialog";
import { Button, EnumButtonStyle } from "../Button/Button";
import "./ConfirmationDialog.scss";

const CLASS_NAME = "confirmation-dialog";

export type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButton: {
    label?: string;
    icon?: string;
  };
  dismissButton: {
    label?: string;
    icon?: string;
  };
  onConfirm: () => void;
  onDismiss: () => void;
};

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmButton,
  dismissButton,
  onConfirm,
  onDismiss,
}: Props) => {
  return (
    <Dialog
      className={CLASS_NAME}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={title}
    >
      <div className={`${CLASS_NAME}__message`}>{message}</div>
      <div className={`${CLASS_NAME}__buttons`}>
        <div className="spacer" />
        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon={dismissButton.icon}
          onClick={onDismiss}
        >
          {dismissButton.label}
        </Button>

        <Button
          buttonStyle={EnumButtonStyle.Primary}
          onClick={onConfirm}
          icon={confirmButton.icon}
        >
          {confirmButton.label}
        </Button>
      </div>
    </Dialog>
  );
};
