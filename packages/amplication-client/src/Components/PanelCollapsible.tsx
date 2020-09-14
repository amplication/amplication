import React, { ReactNode, useCallback, useState } from "react";
import classNames from "classnames";
import AnimateHeight from "react-animate-height";

import { Button, EnumButtonStyle } from "./Button";
import { Panel, Props as PanelProps } from "./Panel";
import "./PanelCollapsible.scss";

type Props = {
  onCollapseChange?: (open: boolean) => {};
  initiallyOpen: boolean;
  headerContent: ReactNode;
} & Omit<PanelProps, "panelStyle">;

const CLASS_NAME = "amp-panel-collapsible";

export const PanelCollapsible = (props: Props) => {
  const {
    initiallyOpen = false,
    onCollapseChange,
    headerContent,
    children,
    className,
    ...rest
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(initiallyOpen);
  const handleCollapseChange = useCallback(() => {
    const nextState = !isOpen;

    setIsOpen((isOpen) => {
      return !isOpen;
    });

    if (onCollapseChange) {
      onCollapseChange(nextState);
    }
  }, [onCollapseChange, isOpen]);

  return (
    <Panel
      {...rest}
      className={classNames(CLASS_NAME, className, {
        "amp-panel-collapsible--open": isOpen,
      })}
    >
      <PanelCollapsibleHeader onCollapseChange={handleCollapseChange}>
        {headerContent}
      </PanelCollapsibleHeader>

      <AnimateHeight
        className={`${CLASS_NAME}__body`}
        duration={500}
        height={isOpen ? "auto" : 0} // see props documentation below
      >
        {children}
      </AnimateHeight>
    </Panel>
  );
};

type PanelCollapsibleHeaderProps = {
  children: ReactNode;
  onCollapseChange: () => void;
};

const PanelCollapsibleHeader = ({
  children,
  onCollapseChange,
}: PanelCollapsibleHeaderProps) => {
  return (
    <div className={`${CLASS_NAME}__header`}>
      <Button
        className={`${CLASS_NAME}__header__collapse`}
        type="button"
        buttonStyle={EnumButtonStyle.Clear}
        icon="chevron_down"
        onClick={onCollapseChange}
      />
      <div className={`${CLASS_NAME}__header__content`}>{children}</div>
    </div>
  );
};
