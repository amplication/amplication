import React, { HTMLProps } from "react";
import {
  CircularProgress as CP,
  CircularProgressProps,
} from "@rmwc/circular-progress";
import "./CircularProgress.scss";

const CLASS_NAME = "amp-circular-progress";

export type Props = CircularProgressProps & HTMLProps<HTMLElement>;

export function CircularProgress(props: Props) {
  return (
    <div className={CLASS_NAME}>
      <CP {...props} />
    </div>
  );
}
