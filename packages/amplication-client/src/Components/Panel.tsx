import React, { ReactNode, CSSProperties } from "react";
import classNames from "classnames";
import "./Panel.scss";

export enum EnumPanelStyle {
  Default = "default",
  Transparent = "transparent",
  Bordered = "bordered",
}

export type Props = {
  /** The display style of the panel */
  panelStyle?: EnumPanelStyle;
  className?: string;
  children: ReactNode;
  shadow?: boolean;
  style?: CSSProperties;
};

export const Panel = ({
  panelStyle = EnumPanelStyle.Default,
  className,
  children,
  shadow,
  style,
}: Props) => {
  return (
    <div
      style={style}
      className={classNames(
        "amp-panel",
        className,
        `amp-panel--${panelStyle}`,
        { "amp-panel--shadow": shadow }
      )}
    >
      {children}
    </div>
  );
};

type PanelHeaderProps = {
  /** Pass multiple children, directly or wrapped with a fragment, to automatically use flex with space between */
  /** Pass a string to automatically use <H2> element for a title */
  children: ReactNode;
  className?: string;
};

export const PanelHeader = ({ children, className }: PanelHeaderProps) => {
  let content = children;
  if (React.Children.toArray(children).every((ch) => typeof ch === "string")) {
    content = <h2>{children}</h2>;
  }

  return (
    <div className={classNames("amp-panel__header", className)}>{content}</div>
  );
};

type PanelExpandableBottomProps = {
  isOpen: boolean;
  children?: ReactNode;
};

export const PanelExpandableBottom = ({
  isOpen,
  children,
}: PanelExpandableBottomProps) => {
  return (
    <div
      className={classNames("amp-panel__expandable-bottom", {
        "amp-panel__expandable-bottom--open": isOpen,
      })}
    >
      {children}
    </div>
  );
};

type PanelBodyProps = {
  isOpen?: boolean;
  children?: ReactNode;
};

export const PanelBody = ({ isOpen = true, children }: PanelBodyProps) => {
  return (
    <div
      className={classNames("amp-panel__body", {
        "amp-panel__Body--open": isOpen,
      })}
    >
      {children}
    </div>
  );
};
