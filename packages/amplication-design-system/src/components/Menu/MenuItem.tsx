import React, { ReactNode } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Button/Button";
import { Tooltip } from "@primer/components";

import { Icon } from "@rmwc/icon";
import "./MenuItem.scss";

export type Props = {
  /** Text to be displayed when the menu is expanded, and in a tooltip */
  title: string;
  /** Optional text to be displayed in the tooltip instead of the title */
  overrideTooltip?: string;
  /** the name of the icon to display, ignored when the component has children */
  icon?: string;
  /** Optional class name to be added to the element */
  className?: string;
  hideTooltip?: boolean;
  children?: ReactNode;
  onClick?: () => void;
};

const DIRECTION = "e";
const ICON_SIZE = "xlarge";

export const MenuItem = ({
  title,
  overrideTooltip,
  icon,
  className,
  children,
  hideTooltip = false,
  onClick,
}: Props) => {
  const content = (
    <Button buttonStyle={EnumButtonStyle.Clear} onClick={onClick}>
      {children ? (
        children
      ) : (
        <>
          <Icon
            icon={{
              icon: icon,
              size: ICON_SIZE,
            }}
          />
          <span className="amp-menu-item__title">{title}</span>
        </>
      )}
    </Button>
  );

  return (
    <div className={classNames("amp-menu-item", className)}>
      {hideTooltip ? (
        content
      ) : (
        <Tooltip
          className="amp-menu-item__tooltip"
          aria-label={overrideTooltip || title}
          direction={DIRECTION}
          noDelay
        >
          {content}
        </Tooltip>
      )}
    </div>
  );
};
