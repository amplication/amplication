import React, { ReactNode } from "react";
import classNames from "classnames";
import "./List.scss";
import { ListItem } from "./ListItem";
import { EnumTextColor } from "../Text/Text";

const CLASS_NAME = "amp-list";

export enum EnumListStyle {
  Default = "default",
  Dark = "dark",
  Transparent = "transparent",
}

export type Props = {
  className?: string;
  children: ReactNode;
  listStyle?: EnumListStyle;
  collapsible?: boolean;
  headerContent?: ReactNode;
  style?: React.CSSProperties;
  themeColor?: EnumTextColor;
};

export function List({
  className,
  children,
  listStyle = EnumListStyle.Default,
  collapsible = false,
  headerContent,
  style = undefined,
  themeColor = undefined,
}: Props) {
  return (
    <div
      style={{
        ...style,
        "--theme-border-color": themeColor //set the css variable to the theme color to be used from the css file
          ? `var(--${themeColor})`
          : undefined,
      }}
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${listStyle}`,
        {
          [`${CLASS_NAME}--with-theme-border`]: !!themeColor,
          [`${CLASS_NAME}--collapsible`]: collapsible,
        },
        className
      )}
    >
      {headerContent && <ListItem> {headerContent}</ListItem>}
      {children}
    </div>
  );
}
