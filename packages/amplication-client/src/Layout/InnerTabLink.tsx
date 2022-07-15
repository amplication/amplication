import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@amplication/design-system";
import classNames from "classnames";
import "./InnerTabLink.scss";

type Props = {
  children: React.ReactNode;
  icon: string;
  to: string;
  onClick?: (selectedItem: any) => void;
  className?: string;
};

const CLASS_NAME = "inner-tab-link";

function InnerTabLink({ children, icon, to, onClick, className }: Props) {
  return (
    <NavLink
      to={to}
      exact
      className={classNames(CLASS_NAME, className)}
      onClick={onClick}
    >
      <Icon icon={icon} size="medium" />
      <span>{children}</span>
    </NavLink>
  );
}

export default InnerTabLink;
