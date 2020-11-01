import React from "react";
import { Icon } from "@rmwc/icon";
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

type Props = {
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
    <Icon
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${style}`,
        `${CLASS_NAME}--${size}`
      )}
      icon={icon}
    />
  );
}

export default CircleIcon;
