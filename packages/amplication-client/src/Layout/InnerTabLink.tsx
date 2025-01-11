import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@amplication/ui/design-system";
import classNames from "classnames";
import "./InnerTabLink.scss";

type Props = {
  children: React.ReactNode;
  icon?: string;
  to: string;
  className?: string;
  exact?: boolean;
};

const CLASS_NAME = "inner-tab-link";

function InnerTabLink({ children, icon, to, className, exact = true }: Props) {
  return (
    <NavLink
      to={to}
      exact={exact}
      className={classNames(CLASS_NAME, className)}
    >
      {icon && <Icon icon={icon} size="small" />}
      <span className={`${CLASS_NAME}__inner-span`}>{children}</span>
    </NavLink>
  );
}

export default InnerTabLink;
