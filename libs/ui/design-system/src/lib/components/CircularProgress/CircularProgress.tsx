import React, { HTMLProps } from "react";
import { CircularProgress as CP, CircularProgressProps } from "@mui/material";
import "./CircularProgress.scss";
import classNames from "classnames";

const CLASS_NAME = "amp-circular-progress";

export type Props = CircularProgressProps &
  Omit<HTMLProps<HTMLElement>, "size"> & {
    centerToParent?: boolean;
    position?: "absolute" | "relative";
    defaultColor?: boolean;
  };

export const CircularProgress = ({
  size = 20,
  className,
  centerToParent = false,
  position,
  defaultColor = true,
  ...rest
}: Props) => {
  return (
    <span
      className={classNames(
        `${CLASS_NAME}`,
        `${centerToParent ? `${CLASS_NAME}--center-to-parent` : ""}`,
        `${defaultColor ? `${CLASS_NAME}--default-color` : ""}`
      )}
      style={{
        position,
      }}
    >
      <CP
        {...rest}
        className={classNames(className)}
        size={size}
        classes={{
          root: `${CLASS_NAME}__root`,
          circle: `${CLASS_NAME}__circle`,
          svg: `${CLASS_NAME}__svg`,
        }}
        sx={{
          color: "inherit",
          ...rest.sx,
        }}
      />
    </span>
  );
};

export default CircularProgress;
