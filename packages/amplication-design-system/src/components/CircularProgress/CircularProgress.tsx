import React, { HTMLProps } from "react";
import { CircularProgress as CP, CircularProgressProps } from "@mui/material";
import "./CircularProgress.scss";

const CLASS_NAME = "amp-circular-progress";

export type Props = CircularProgressProps & HTMLProps<HTMLElement>;

export function CircularProgress({ size = 20, ...rest }: Props) {
  return (
    <div className={CLASS_NAME}>
      <CP {...rest} size={size} />
    </div>
  );
}
