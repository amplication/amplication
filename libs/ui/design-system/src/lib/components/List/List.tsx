import React, { ReactNode } from "react";
import classNames from "classnames";
import "./List.scss";
import { ListItem } from "./ListItem";

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
};

export function List({
  className,
  children,
  listStyle = EnumListStyle.Default,
  collapsible = false,
  headerContent,
}: Props) {
  return (
    <div
      className={classNames(
        CLASS_NAME,
        `${CLASS_NAME}--${listStyle}`,
        {
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
