import React, { ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import classNames from "classnames";
import "./BackNavigation.scss";
import { Icon, IconProps } from "@amplication/ui/design-system";

type Props = LinkProps & {
  label?: string | ReactNode;
  iconSize?: IconProps["size"];
};

const CLASS_NAME = "back-navigation";

export const BackNavigation = ({
  to,
  label,
  className,
  iconSize,
  ...rest
}: Props) => {
  return (
    <Link className={classNames(CLASS_NAME, className)} to={to} {...rest}>
      <Icon icon="arrow_left" size={iconSize} /> {label}
    </Link>
  );
};
