import React from "react";
import { useRouteMatch, NavLink } from "react-router-dom";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Tooltip } from "@primer/components";

import { Icon } from "@rmwc/icon";
import "./MenuItem.scss";

type Props = {
  /** Optional URL to navigate to on click  */
  to?: string;
  /** Text to be displayed when the menu is expanded, and in a tooltip */
  title: string;
  /** Optional text to be displayed in the tooltip instead of the title */
  overrideTooltip?: string;
  /** the name of the icon to display */
  icon: string;
  /** Optional class name to be added to the element */
  className?: string;
  onClick?: () => void;
};

const NON_URL = "non-url";
const DIRECTION = "e";
const ICON_SIZE = "xlarge";

const MenuItem = ({
  to,
  title,
  overrideTooltip,
  icon,
  className,
  onClick,
}: Props) => {
  const match = useRouteMatch(to || NON_URL);

  return (
    <div
      className={classNames("amp-menu-item", className, {
        "amp-menu-item--active": match !== null,
      })}
    >
      <Tooltip
        aria-label={overrideTooltip || title}
        direction={DIRECTION}
        noDelay
      >
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          as={to ? NavLink : Button}
          onClick={onClick}
          to={to}
          title={title}
        >
          <>
            <Icon
              icon={{
                icon: icon,
                size: ICON_SIZE,
              }}
            />
            <span className="amp-menu-item__title">{title}</span>
          </>
        </Button>
      </Tooltip>
    </div>
  );
};

export default MenuItem;
