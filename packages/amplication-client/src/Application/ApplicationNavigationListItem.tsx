import React from "react";
import { useRouteMatch, NavLink } from "react-router-dom";
import classNames from "classnames";

// import { ListItem } from "@rmwc/list";
import { Icon } from "@rmwc/icon";
import { SideNav } from "@primer/components";

export type menuItem = {
  to: string;
  title: string;
  icon: string;
  className?: string;
};

type Props = { menuItem: menuItem };

const ApplicationNavigationListItem = ({ menuItem }: Props) => {
  const { to, title, icon, className } = menuItem;

  const match = useRouteMatch(to);
  return (
    <SideNav.Link
      as={NavLink}
      to={to}
      selected={match !== null}
      title={title}
      className={classNames("side-nav__link", className)}
    >
      <Icon icon={icon} />
    </SideNav.Link>
  );
};

export default ApplicationNavigationListItem;
