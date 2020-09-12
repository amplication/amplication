import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Panel.scss";
import { Button, EnumButtonStyle } from "./Button";

export enum EnumPanelStyle {
  Default = "default",
  Transparent = "transparent",
  Bordered = "bordered",
  Collapsible = "collapsible",
}

type Props = {
  /** The display style of the panel */
  panelStyle?: EnumPanelStyle;
  className?: string;
  children: ReactNode;
  shadow?: boolean;
};

export const Panel = ({
  panelStyle = EnumPanelStyle.Default,
  className,
  children,
  shadow,
}: Props) => {
  return (
    <div
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
  title: string;
  action?: {
    icon?: string;
    label?: string;
    buttonStyle?: EnumButtonStyle;
    onClick?: () => void;
  };
};

export const PanelHeader = ({ title, action }: PanelHeaderProps) => {
  return (
    <div className="amp-panel__header">
      <h2>{title}</h2>
      {action && (
        <Button
          type="button"
          buttonStyle={action.buttonStyle || EnumButtonStyle.Clear}
          icon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
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
