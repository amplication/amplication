import React from "react";
import { useRouteMatch, NavLink } from "react-router-dom";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";

import { Icon } from "@rmwc/icon";
import "./MenuItem.scss";

type Props = {
  to?: string;
  title: string;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const NON_URL = "non-url";

const MenuItem = ({ to, title, icon, className, children, onClick }: Props) => {
  const match = useRouteMatch(to || NON_URL);

  return (
    <Button
      buttonStyle={EnumButtonStyle.Clear}
      as={to ? NavLink : Button}
      onClick={onClick}
      to={to}
      title={title}
      className={classNames("amp-menu-item", className, {
        "amp-menu-item--active": match !== null,
      })}
    >
      {children ? (
        children
      ) : (
        <>
          <Icon
            icon={{
              icon: icon,
              size: "xlarge",
            }}
          />
          <span className="amp-menu-item__title">{title}</span>
        </>
      )}
    </Button>
  );
};

export default MenuItem;
