import React from "react";
import classNames from "classnames";
import {
  Dialog as PrimerDialog,
  DialogProps as PrimerDialogProps,
} from "@primer/components";
import { Button, EnumButtonStyle } from "./Button";
import "./Dialog.scss";

const CLASS_NAME = "amp-dialog";

type DialogProps = {
  title: string;
};
export type Props = DialogProps & PrimerDialogProps;

export const Dialog = ({
  isOpen,
  onDismiss,
  children,
  title,
  className,
}: Props) => {
  return (
    <PrimerDialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      className={classNames("amp", CLASS_NAME, className)}
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
