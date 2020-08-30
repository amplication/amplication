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

type Props = {
  style?: EnumCircleIconStyle;
  icon: string;
  large?: boolean;
};

function CircleIcon({
  style = EnumCircleIconStyle.Positive,
  icon,
  large,
}: Props) {
  const largeClassName = large ? `${CLASS_NAME}--large` : "";
  return (
    <Icon
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${style}`,
        largeClassName
      )}
      icon={icon}
    />
  );
}

export default CircleIcon;
