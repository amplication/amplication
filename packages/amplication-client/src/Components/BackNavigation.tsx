import React from "react";
import { Link, LinkProps } from "react-router-dom";
import classNames from "classnames";
import "./BackNavigation.scss";
import { Icon } from "@amplication/ui/design-system";

type Props = LinkProps & {
  label?: string;
};

const CLASS_NAME = "back-navigation";

export const BackNavigation = ({ to, label, className, ...rest }: Props) => {
  return (
    <Link className={classNames(CLASS_NAME, className)} to={to} {...rest}>
      <Icon icon="arrow_left" /> {label}
    </Link>
  );
};
