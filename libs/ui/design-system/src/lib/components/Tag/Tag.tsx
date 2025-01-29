import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Tag.scss";
import { useTagColorStyle } from "../ColorPicker/useTagColorStyle";

export type Props = {
  color: string;
  value: string | ReactNode;
  textMode?: boolean;
};

const CLASS_NAME = "amp-tag";

export function Tag({ color, value, textMode = false }: Props) {
  const { style, themeVars } = useTagColorStyle(color);

  return (
    <span
      className={classNames(CLASS_NAME, {
        "text-mode": textMode,
      })}
      style={{ ...style, ...themeVars }}
    >
      {value}
    </span>
  );
}
