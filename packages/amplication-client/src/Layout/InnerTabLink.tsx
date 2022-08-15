import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@amplication/design-system";
import classNames from "classnames";
import "./InnerTabLink.scss";

type Props = {
  children: React.ReactNode;
  icon: string;
  to: string;
  className?: string;
};

const CLASS_NAME = "inner-tab-link";

function InnerTabLink({ children, icon, to, className }: Props) {
  return (
    <NavLink
      to={to}
      exact
      className={classNames(CLASS_NAME, className)}
    >
      <Icon icon={icon} size="medium" />
      <span>{children}</span>
    </NavLink>
  );
}

export default InnerTabLink;
