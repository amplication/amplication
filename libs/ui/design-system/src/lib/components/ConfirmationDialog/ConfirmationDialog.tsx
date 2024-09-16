import React from "react";
import {
  Dialog,
  Props as DialogProps,
  EnumDialogStyle,
} from "../Dialog/Dialog";
import { Button, EnumButtonStyle } from "../Button/Button";
import "./ConfirmationDialog.scss";
import classNames from "classnames";

const CLASS_NAME = "confirmation-dialog";

export type Props = DialogProps & {
  isOpen: boolean;
  message: string | React.ReactNode;
  confirmButton: {
    label?: string;
    icon?: string;
    disabled?: boolean;
  };
  dismissButton?: {
    label?: string;
    icon?: string;
  };
  btnClassName?: string;
  onConfirm: () => void;
  onDismiss: () => void;
};

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmButton,
  dismissButton,
  btnClassName,
  onConfirm,
  onDismiss,
}: Props) => {
  return (
    <Dialog
      className={CLASS_NAME}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={title}
      showCloseButton={false}
      dialogStyle={EnumDialogStyle.Warning}
    >
      <div className={`${CLASS_NAME}__message`}>{message}</div>
      <hr className={`${CLASS_NAME}__separator`} />
      <div
        className={classNames(
          `${CLASS_NAME}__buttons`,
          btnClassName && btnClassName
        )}
      >
        <div className="spacer" />
        {dismissButton && (
          <Button
            buttonStyle={EnumButtonStyle.Text}
            icon={dismissButton.icon}
            onClick={onDismiss}
          >
            {dismissButton.label}
          </Button>
        )}

        <Button
          buttonStyle={EnumButtonStyle.Primary}
          onClick={onConfirm}
          icon={confirmButton.icon}
          disabled={confirmButton.disabled}
        >
          {confirmButton.label}
        </Button>
      </div>
    </Dialog>
  );
};
