import React, { ReactNode, useCallback, useState } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "./Button";
import { Panel, Props as PanelProps } from "./Panel";
import "./PanelCollapsible.scss";

type Props = {
  onToggle?: (open: boolean) => {};
  open?: boolean;
  headerContent: ReactNode;
} & Omit<PanelProps, "panelStyle">;

const CLASS_NAME = "amp-panel-collapsible";

export const PanelCollapsible = (props: Props) => {
  const {
    open,
    onToggle,
    headerContent,
    children,
    className,
    ...panelProps
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(open || true);
  const handleToggleHeader = useCallback(() => {
    const nextState = !isOpen;

    setIsOpen((isOpen) => {
      return !isOpen;
    });

    if (onToggle) {
      onToggle(nextState);
    }
  }, [onToggle, isOpen]);

  return (
    <Panel
      {...panelProps}
      className={classNames(CLASS_NAME, className, {
        "amp-panel-collapsible--open": isOpen,
      })}
    >
      <PanelCollapsibleHeader onToggle={handleToggleHeader}>
        {headerContent}
      </PanelCollapsibleHeader>

      <div className={`${CLASS_NAME}__body`}>{children}</div>
    </Panel>
  );
};

type PanelCollapsibleHeaderProps = {
  children: ReactNode;
  onToggle: () => void;
};

const PanelCollapsibleHeader = ({
  children,
  onToggle,
}: PanelCollapsibleHeaderProps) => {
  return (
    <div className={`${CLASS_NAME}__header`}>
      <Button
        className={`${CLASS_NAME}__header__collapse`}
        type="button"
        buttonStyle={EnumButtonStyle.Clear}
        icon="chevron_down"
        onClick={onToggle}
      />
      <div className={`${CLASS_NAME}__header__content`}>{children}</div>
    </div>
  );
};
