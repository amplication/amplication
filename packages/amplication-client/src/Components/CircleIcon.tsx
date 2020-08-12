import React from "react";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import "./CircleIcon.scss";

export enum EnumCircleIconStyle {
  Primary = "Primary",
  Secondary = "Secondary",
  Success = "Success",
  Error = "Error",
  Warning = "Warning",
}

type Props = {
  style?: EnumCircleIconStyle;
  icon: string;
};

function CircleIcon({ style = EnumCircleIconStyle.Success, icon }: Props) {
  return (
    <Icon
      className={classNames(
        "circle-icon",
        `circle-icon--${style.toLowerCase()}`
      )}
      icon={icon}
    ></Icon>
  );
}

export default CircleIcon;
