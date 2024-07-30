import React from "react";
import classNames from "classnames";
import {
  Dialog as PrimerDialog,
  DialogProps as PrimerDialogProps,
  ThemeProvider,
} from "@primer/react";
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
  dialogStyle?: EnumDialogStyle;
  children?: React.ReactNode;
  showCloseButton?: boolean;
};
export type Props = DialogProps & PrimerDialogProps;

export const Dialog: React.FC<Props> = ({
  isOpen,
  onDismiss,
  children,
  title,
  className,
  dialogStyle = EnumDialogStyle.Default,
  showCloseButton = true,
}) => {
  //colors.primer.canvas.backdrop
  const theme = {
    colors: {
      primer: {
        canvas: {
          backdrop: "rgba(12, 11, 14, 0.48)",
        },
      },
    },
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <ThemeProvider theme={theme}>
      <PrimerDialog
        isOpen={isOpen}
        onDismiss={onDismiss}
        className={classNames(
          CLASS_NAME,
          className,
          `${CLASS_NAME}--${dialogStyle}`
        )}
        sx={{}}
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
      </PrimerDialog>
    </ThemeProvider>
  );
};
