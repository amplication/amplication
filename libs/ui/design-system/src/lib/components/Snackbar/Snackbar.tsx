import React from "react";
import classNames from "classnames";
import { Snackbar as MuiSnackbar, SnackbarProps } from "@mui/material";

import "./Snackbar.scss";

export enum EnumMessageType {
  Error = "Error",
  Success = "Success",
  Warning = "Warning",
  Info = "Info",
  Default = "Default",
}

export type Props = SnackbarProps & {
  messageType?: EnumMessageType;
};

const CLASS_NAME = "amp-snackbar";

export function Snackbar({
  className,
  messageType = EnumMessageType.Default,
  ...rest
}: Props) {
  return (
    <MuiSnackbar
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${messageType.toLowerCase()}`,
        className
      )}
      {...rest}
    />
  );
}
