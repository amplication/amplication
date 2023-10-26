import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Chip.scss";

export enum EnumChipStyle {
  ThemePurple = "secondary",
  ThemeBlue = "theme-blue",
  ThemeGreen = "theme-green",
  ThemeTurquoise = "theme-turquoise",
  ThemeRed = "theme-red",
  ThemeOrange = "theme-orange",
}

export type Props = {
  className?: string;
  children: ReactNode;
  chipStyle: EnumChipStyle;
};

const CLASS_NAME = "amp-chip";

export function Chip({ className, chipStyle, children }: Props) {
  const chipStyleElement = { backgroundColor: `var(--${chipStyle})` };

  return (
    <span
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${chipStyle}`,
        className
      )}
      style={chipStyleElement}
    >
      {children}
    </span>
  );
}
