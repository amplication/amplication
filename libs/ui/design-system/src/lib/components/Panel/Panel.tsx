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
  clickable?: boolean;
  onClick?: (event: any) => void;
};

export const Panel = React.forwardRef(
  (
    {
      panelStyle = EnumPanelStyle.Default,
      className,
      children,
      shadow,
      style,
      clickable,
      onClick,
    }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        onClick={onClick}
        style={style}
        role={clickable ? "button" : undefined}
        className={classNames(
          "amp-panel",
          className,
          `amp-panel--${panelStyle}`,
          { "amp-panel--clickable": clickable },
          { "amp-panel--shadow": shadow }
        )}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export type PanelHeaderProps = {
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
