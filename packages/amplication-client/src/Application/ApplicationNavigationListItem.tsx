import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

import { ListItem } from "@rmwc/list";
import { Icon } from "@rmwc/icon";

export type menuItem = {
  to: string;
  title: string;
  icon: string;
  iconSelected: string;
};

type Props = { menuItem: menuItem };

const ApplicationNavigationListItem = ({ menuItem }: Props) => {
  const { to, title, icon, iconSelected } = menuItem;

  const match = useRouteMatch(to);
  return (
    <ListItem activated={match !== null}>
      <Link title={title} to={to}>
        <Icon icon={match ? iconSelected : icon} />
      </Link>
    </ListItem>
  );
};

export default ApplicationNavigationListItem;
