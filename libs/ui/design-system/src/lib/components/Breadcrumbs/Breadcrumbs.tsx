import React from "react";
import {
  Breadcrumbs as PrimerBreadcrumb,
  BreadcrumbsProps as PrimerBreadcrumbProps,
  BreadcrumbsItemProps as PrimerBreadcrumbItemProps,
} from "@primer/react";
import "./Breadcrumbs.scss";

export type Props = PrimerBreadcrumbProps;

export const Breadcrumbs = ({ children }: Props) => {
  return (
    <PrimerBreadcrumb className="amp-breadcrumbs">{children}</PrimerBreadcrumb>
  );
};

export default Breadcrumbs;

export type ItemProps = PrimerBreadcrumbItemProps;

function Item(props: ItemProps) {
  return <PrimerBreadcrumb.Item {...props} />;
}

Breadcrumbs.Item = Item;
