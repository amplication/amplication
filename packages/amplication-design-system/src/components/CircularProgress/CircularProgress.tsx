import React, { HTMLProps } from "react";
import {
  CircularProgress as CP,
  CircularProgressProps,
} from "@rmwc/circular-progress";
import "./CircularProgress.scss";

const CLASS_NAME = "circular-progress";

export type Props = CircularProgressProps & HTMLProps<HTMLElement>;

export function CircularProgress(props: Props) {
  return <CP {...props} className={CLASS_NAME} />;
}
