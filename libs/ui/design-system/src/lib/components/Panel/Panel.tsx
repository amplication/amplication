import React, { ReactNode, CSSProperties } from "react";
import classNames from "classnames";
import "./Panel.scss";
import { EnumTextColor } from "../Text/Text";

//extend CSSProperties to allow adding css-variables to style
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

export enum EnumPanelStyle {
  Default = "default",
  Transparent = "transparent",
  Bordered = "bordered",
  Bold = "bold",
  Error = "error",
  Surface = "surface",
}

export type Props = {
  /** The display style of the panel */
  panelStyle?: EnumPanelStyle;
  className?: string;
  children: ReactNode;
  shadow?: boolean;
  style?: CSSProperties;
  clickable?: boolean;
  themeColor?: EnumTextColor;
  onClick?: (event: any) => void;
  nonClickableFooter?: ReactNode;
  removePadding?: boolean;
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
      themeColor = undefined,
      nonClickableFooter = undefined,
      onClick,
      removePadding = false,
    }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const withContentWrapper = !!nonClickableFooter;

    //When used with nonClickableFooter, we add a wrapper to the content to allow a click on the content only
    //the clickableProps are added to the wrapper, not the main div
    const clickableProps = {
      onClick: onClick,
      role: clickable ? "button" : undefined,
    };

    const paddingStyle = removePadding ? { padding: 0 } : {};

    return (
      <div
        style={{
          ...style,
          ...paddingStyle,
          "--theme-border-color": themeColor //set the css variable to the theme color to be used from the css file
            ? `var(--${themeColor})`
            : undefined,
        }}
        className={classNames(
          "amp-panel",
          className,
          `amp-panel--${panelStyle}`,
          { "amp-panel--clickable": clickable },
          { "amp-panel--shadow": shadow },
          { "amp-panel--with-theme-border": !!themeColor },
          { "amp-panel--with-content-wrapper": withContentWrapper }
        )}
        {...(!withContentWrapper ? clickableProps : {})}
        ref={ref}
      >
        {withContentWrapper ? (
          <div className="amp-panel__content-wrapper" {...clickableProps}>
            {children}
          </div>
        ) : (
          children
        )}

        {nonClickableFooter && (
          <div className="amp-panel__non-clickable-footer">
            {nonClickableFooter}
          </div>
        )}
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
