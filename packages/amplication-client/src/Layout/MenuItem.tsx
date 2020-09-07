import React from "react";
import { useRouteMatch, NavLink } from "react-router-dom";
import classNames from "classnames";

import { Icon } from "@rmwc/icon";
import { SideNav } from "@primer/components";

type Props = {
  to: string;
  title: string;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
};

const MenuItem = ({ to, title, icon, className, children }: Props) => {
  const match = useRouteMatch(to);
  return (
    <SideNav.Link
      as={NavLink}
      to={to}
      selected={match !== null}
      title={title}
      className={classNames("side-nav__link", className)}
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
          <span className="side-nav__link__title">{title}</span>
        </>
      )}
    </SideNav.Link>
  );
};

export default MenuItem;
