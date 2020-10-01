import React, { ReactNode, useCallback, useState } from "react";
import classNames from "classnames";
import AnimateHeight from "react-animate-height";

import { Button, EnumButtonStyle } from "./Button";
import { Panel, Props as PanelProps } from "./Panel";
import "./PanelCollapsible.scss";

type Props = {
  onCollapseChange?: (open: boolean) => {};
  /**Whether the panel is initially open or not */
  initiallyOpen?: boolean;
  /**When true the user cannot collapse manually, and the collapse button is hidden  */
  disableManualCollapse?: boolean;
  /**Whether the panel collapse functionality is enabled. When false, only the header of the panel is visible and the body is hidden */
  /**By settings initiallyOpen to True, and disableManualCollapse to True, the developer can control the collapse state from the parent component by changing enableCollapse */
  enableCollapse?: boolean;
  /**The content of the panel header */
  headerContent: ReactNode;
} & Omit<PanelProps, "panelStyle">;

const CLASS_NAME = "amp-panel-collapsible";

export const PanelCollapsible = (props: Props) => {
  const {
    initiallyOpen = false,
    enableCollapse = true,
    headerContent,
    children,
    className,
    disableManualCollapse = false,
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
        "amp-panel-collapsible--open": isOpen && enableCollapse,
      })}
    >
      <PanelCollapsibleHeader
        onCollapseChange={handleCollapseChange}
        enableCollapse={enableCollapse}
        disableManualCollapse={disableManualCollapse}
      >
        {headerContent}
      </PanelCollapsibleHeader>

      <AnimateHeight
        contentClassName={`${CLASS_NAME}__body`}
        duration={500}
        height={isOpen && enableCollapse ? "auto" : 0}
      >
        {children}
      </AnimateHeight>
    </Panel>
  );
};

type PanelCollapsibleHeaderProps = {
  children: ReactNode;
  enableCollapse: boolean;
  disableManualCollapse: boolean;
  onCollapseChange: () => void;
};

const PanelCollapsibleHeader = ({
  children,
  enableCollapse,
  disableManualCollapse,
  onCollapseChange,
}: PanelCollapsibleHeaderProps) => {
  const handleCollapseChange = useCallback(
    (event) => {
      event.stopPropagation();
      if (!disableManualCollapse) {
        onCollapseChange();
      }
    },
    [onCollapseChange, disableManualCollapse]
  );

  return (
    <div className={`${CLASS_NAME}__header`} onClick={handleCollapseChange}>
      {!disableManualCollapse && (
        <Button
          className={`${CLASS_NAME}__header__collapse`}
          type="button"
          buttonStyle={EnumButtonStyle.Clear}
          icon="chevron_down"
          onClick={handleCollapseChange}
          disabled={!enableCollapse}
        />
      )}
      <div className={`${CLASS_NAME}__header__content`}>{children}</div>
    </div>
  );
};
