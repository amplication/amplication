import React, { ReactNode, useCallback } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import { FixedMenuPanel } from "../util/teleporter";

import { Icon, Tooltip } from "@amplication/ui/design-system";

type Props = {
  /** Text to be displayed as a tooltip */
  tooltip: string;
  /** the name of the icon to display, or false to hide the icon */
  icon: string | boolean;
  /** indication whether the fixed panel is open or not */
  isOpen: boolean;
  /* the content to display in the fixed panel*/
  children?: ReactNode;
  /* the key of the panel to be returned to the menu component when this item is clicked*/
  panelKey: string;
  /* The value to show on a badge. When null or undefined the badge is hidden*/
  badgeValue?: string | null;

  onClick: (panelKey: string) => void;
};

const DIRECTION = "e";
const ICON_SIZE = "xlarge";

const MenuItemWithFixedPanel = ({
  tooltip,
  icon,
  isOpen,
  children,
  panelKey,
  badgeValue,
  onClick,
}: Props) => {
  const handleClick = useCallback(() => {
    onClick(panelKey);
  }, [panelKey, onClick]);

  return (
    <div
      className={classNames("amp-menu-item amp-menu-item--with-fixed-panel", {
        "amp-menu-item--with-fixed-panel--active": isOpen && icon,
      })}
    >
      <div className="amp-menu-item__wrapper">
        {icon && (
          <Tooltip
            className="amp-menu-item__tooltip"
            aria-label={tooltip}
            direction={DIRECTION}
            noDelay
          >
            <Button buttonStyle={EnumButtonStyle.Text} onClick={handleClick}>
              <Icon icon={icon as string} size={ICON_SIZE} />
            </Button>
            {badgeValue && (
              <span className="amp-menu-item__badge">{badgeValue}</span>
            )}
          </Tooltip>
        )}
      </div>
      {isOpen && <FixedMenuPanel.Source>{children}</FixedMenuPanel.Source>}
    </div>
  );
};

export default MenuItemWithFixedPanel;
