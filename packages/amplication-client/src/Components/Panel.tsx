import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Panel.scss";
import { Button, EnumButtonStyle } from "./Button";

export enum EnumPanelStyle {
  Default = "default",
  Transparent = "transparent",
  Bordered = "bordered",
}

type Props = {
  /** The display style of the panel */
  panelStyle?: EnumPanelStyle;
  className: string;
  children: ReactNode;
};

export const Panel = ({
  panelStyle = EnumPanelStyle.Default,
  className,
  children,
}: Props) => {
  return (
    <div
      className={classNames("amp-panel", className, `amp-panel--${panelStyle}`)}
    >
      {children}
    </div>
  );
};

type PanelHeaderProps = {
  title: string;
  action?: {
    icon: string;
    onClick: () => void;
  };
};

export const PanelHeader = ({ title, action }: PanelHeaderProps) => {
  return (
    <div className="amp-panel__header">
      <h2>{title}</h2>
      {action && (
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon={action.icon}
          onClick={action.onClick}
        ></Button>
      )}
    </div>
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
