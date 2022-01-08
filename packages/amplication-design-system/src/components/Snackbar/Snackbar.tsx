import React from "react";
import classNames from "classnames";
import { Snackbar as MuiSnackbar, SnackbarProps } from "@mui/material";

import "./Snackbar.scss";

export type Props = SnackbarProps;

export function Snackbar({ className, ...rest }: Props) {
  return (
    <MuiSnackbar className={classNames("amp-snackbar", className)} {...rest} />
  );
}
