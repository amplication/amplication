import React from "react";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import "./CircleIcon.scss";

export enum EnumCircleIconStyle {
  Primary = "primary",
  Secondary = "secondary",
  Success = "success",
  Error = "error",
  Warning = "warning",
}

type Props = {
  style?: EnumCircleIconStyle;
  icon: string;
};

function CircleIcon({ style = EnumCircleIconStyle.Success, icon }: Props) {
  return (
    <Icon
      className={classNames("circle-icon", `circle-icon--${style}`)}
      icon={icon}
    ></Icon>
  );
}

export default CircleIcon;
