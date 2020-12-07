import React from "react";
import classNames from "classnames";
import {
  Dialog as PrimerDialog,
  DialogProps as PrimerDialogProps,
} from "@primer/components";
import { Button, EnumButtonStyle } from "../Button/Button";
import "./Dialog.scss";

const CLASS_NAME = "amp-dialog";

export enum EnumDialogStyle {
  Success = "success",
  Warning = "warning",
  Error = "error",
  Default = "default",
}

type DialogProps = {
  /** The display style of the dialog */
  dialogStyle?: EnumDialogStyle;
  title: string;
};
export type Props = DialogProps & PrimerDialogProps;

export const Dialog = ({
  isOpen,
  onDismiss,
  children,
  title,
  className,
  dialogStyle = EnumDialogStyle.Default,
}: Props) => {
  return (
    <PrimerDialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      className={classNames(
        CLASS_NAME,
        className,
        `${CLASS_NAME}--${dialogStyle}`
      )}
    >
      <div className={`${CLASS_NAME}__header`}>
        <h3>{title}</h3>
        <Button
          icon="close"
          buttonStyle={EnumButtonStyle.Clear}
          onClick={onDismiss}
        />
      </div>
      <div className={`${CLASS_NAME}__body`}>{children}</div>
    </PrimerDialog>
  );
};
