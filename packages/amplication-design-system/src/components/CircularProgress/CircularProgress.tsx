import React, { HTMLProps } from "react";
import { CircularProgress as CP, CircularProgressProps } from "@mui/material";
import "./CircularProgress.scss";
import classNames from "classnames";

const CLASS_NAME = "amp-circular-progress";

export type Props = CircularProgressProps &
  HTMLProps<HTMLElement> & {
    centerToParent?: boolean;
  };

export function CircularProgress({
  size = 20,
  centerToParent = false,
  ...rest
}: Props) {
  return (
    <span
      className={classNames(
        `${CLASS_NAME}`,
        `${centerToParent ? `${CLASS_NAME}--center-to-parent` : ""}`
      )}
    >
      <CP {...rest} size={size} />
    </span>
  );
}
