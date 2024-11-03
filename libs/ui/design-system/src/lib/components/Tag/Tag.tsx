import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Tag.scss";
import { useTagColorStyle } from "../ColorPicker/useTagColorStyle";

export type Props = {
  color: string;
  value: string | ReactNode;
};

const CLASS_NAME = "amp-tag";

export function Tag({ color, value }: Props) {
  const { style } = useTagColorStyle(color);

  return (
    <span className={classNames(CLASS_NAME)} style={style}>
      {value}
    </span>
  );
}
