import React from "react";
import { Icon } from "../Icon/Icon";
import classNames from "classnames";
import "./CircleIcon.scss";

const CLASS_NAME = "circle-icon";
export enum EnumCircleIconStyle {
  Primary = "primary",
  Secondary = "secondary",
  Positive = "positive",
  Negative = "negative",
  Warning = "warning",
}

export enum EnumCircleIconSize {
  Small = "small",
  Default = "default",
  Large = "large",
}

export type Props = {
  style?: EnumCircleIconStyle;
  icon: string;
  size?: EnumCircleIconSize;
};

function CircleIcon({
  style = EnumCircleIconStyle.Positive,
  icon,
  size = EnumCircleIconSize.Default,
}: Props) {
  return (
    <span
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${style}`,
        `${CLASS_NAME}--${size}`
      )}
    >
      <Icon icon={icon} />
    </span>
  );
}

export default CircleIcon;
