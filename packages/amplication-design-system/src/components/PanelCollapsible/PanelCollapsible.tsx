import React, { ReactNode, useCallback, useState } from "react";
import classNames from "classnames";
import AnimateHeight from "react-animate-height";

import { Button, EnumButtonStyle } from "../Button/Button";
import { Panel, Props as PanelProps } from "../Panel/Panel";
import "./PanelCollapsible.scss";

export type Props = {
  onCollapseChange?: (open: boolean) => Record<string, unknown>;
  /**Whether the panel is initially open or not */
  initiallyOpen?: boolean;
  /**When true the user cannot collapse manually, and the collapse button is hidden  */
  manualCollapseDisabled?: boolean;
  /**
   * Whether the panel collapse functionality is enabled. When false, only the header of the panel is visible and the body is hidden.
   * By settings initiallyOpen to True, and manualCollapseDisabled to True, the developer can control the collapse state from the parent component by changing collapseEnabled
   */
  collapseEnabled?: boolean;
  /**The content of the panel header */
  headerContent: ReactNode;
} & Omit<PanelProps, "panelStyle">;

const CLASS_NAME = "amp-panel-collapsible";

export const PanelCollapsible = (props: Props) => {
  const {
    initiallyOpen = false,
    collapseEnabled = true,
    headerContent,
    children,
    className,
    manualCollapseDisabled = false,
    onCollapseChange,
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
        "amp-panel-collapsible--open": isOpen && collapseEnabled,
      })}
    >
      <PanelCollapsibleHeader
        onCollapseChange={handleCollapseChange}
        collapseEnabled={collapseEnabled}
        manualCollapseDisabled={manualCollapseDisabled}
      >
        {headerContent}
      </PanelCollapsibleHeader>

      <AnimateHeight
        contentClassName={`${CLASS_NAME}__body`}
        duration={500}
        height={isOpen && collapseEnabled ? "auto" : 0}
      >
        {children}
      </AnimateHeight>
    </Panel>
  );
};

type PanelCollapsibleHeaderProps = {
  children: ReactNode;
  collapseEnabled: boolean;
  manualCollapseDisabled: boolean;
  onCollapseChange: () => void;
};

const PanelCollapsibleHeader = ({
  children,
  collapseEnabled,
  manualCollapseDisabled,
  onCollapseChange,
}: PanelCollapsibleHeaderProps) => {
  const handleCollapseChange = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (!manualCollapseDisabled) {
        onCollapseChange();
      }
    },
    [onCollapseChange, manualCollapseDisabled]
  );

  return (
    <div className={`${CLASS_NAME}__header`} onClick={handleCollapseChange}>
      {!manualCollapseDisabled && (
        <Button
          className={`${CLASS_NAME}__header__collapse`}
          type="button"
          buttonStyle={EnumButtonStyle.Text}
          icon="chevron_down"
          onClick={handleCollapseChange}
          disabled={!collapseEnabled}
        />
      )}
      <div className={`${CLASS_NAME}__header__content`}>{children}</div>
    </div>
  );
};
