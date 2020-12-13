import React from "react";
import { Snackbar as RmwcSnackbar, SnackbarProps } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import "./Snackbar.scss";

export type Props = SnackbarProps;

export function Snackbar(props: Props) {
  return <RmwcSnackbar className="amp-snackbar" {...props} />;
}
