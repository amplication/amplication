import React from "react";
import { Button, EnumButtonStyle } from "../Button/Button";
import "./Dialog.scss";
import classNames from "classnames";
import { Dialog as MuiDialog } from "@mui/material";

const CLASS_NAME = "amp-dialog";

export enum EnumDialogStyle {
  Success = "success",
  Warning = "warning",
  Error = "error",
  Default = "default",
}

type DialogProps = {
  dialogStyle?: EnumDialogStyle;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  isOpen: boolean;
  onDismiss: () => void;
  title?: string;
  className?: string;
};
export type Props = DialogProps; //& MuiDialogProps;

export const Dialog: React.FC<Props> = ({
  isOpen = false,
  onDismiss,
  children,
  title,
  className,
  dialogStyle = EnumDialogStyle.Default,
  showCloseButton = true,
}) => {
  return isOpen ? (
    <MuiDialog
      fullScreen={false}
      open={isOpen}
      onClick={(e) => e.stopPropagation()}
      onClose={onDismiss}
      className={classNames(
        CLASS_NAME,
        className,
        `${CLASS_NAME}--${dialogStyle}`
      )}
    >
      <div className={`${CLASS_NAME}__header`}>
        <div className={`${CLASS_NAME}__title`}>{title}</div>
        {showCloseButton && (
          <Button
            icon="close"
            buttonStyle={EnumButtonStyle.Text}
            onClick={onDismiss}
          />
        )}
      </div>
      <div className={`${CLASS_NAME}__body`}>{children}</div>
    </MuiDialog>
  ) : null;
};
