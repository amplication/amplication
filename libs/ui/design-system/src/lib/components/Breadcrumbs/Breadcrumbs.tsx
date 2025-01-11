import React, { Children } from "react";
import "./Breadcrumbs.scss";
import MuiBreadcrumbs, {
  BreadcrumbsProps as MuiBreadcrumbsProps,
} from "@mui/material/Breadcrumbs";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { Link } from "react-router-dom";
import { EnumTextStyle, Text } from "../Text/Text";

export type Props = MuiBreadcrumbsProps;
const CLASS_NAME = "amp-breadcrumbs";

export const Breadcrumbs = ({ children }: Props) => {
  return (
    <MuiBreadcrumbs
      classes={{
        separator: `${CLASS_NAME}__separator`,
        li: `${CLASS_NAME}__item_wrapper`,
      }}
      className={CLASS_NAME}
      aria-label="breadcrumb"
    >
      {children}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;

export type ItemProps = MuiLinkProps & {
  to: string;
};

function Item(props: ItemProps) {
  const { children, to, ...rest } = props;
  return (
    <MuiLink
      className={`${CLASS_NAME}__link`}
      to={to}
      component={Link}
      {...rest}
    >
      <Text textStyle={EnumTextStyle.Tag}>{children}</Text>
    </MuiLink>
  );
}

Breadcrumbs.Item = Item;
