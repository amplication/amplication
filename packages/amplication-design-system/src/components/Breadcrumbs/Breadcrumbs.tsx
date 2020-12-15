import React from "react";
import {
  Breadcrumb as PrimerBreadcrumb,
  BreadcrumbProps as PrimerBreadcrumbProps,
  BreadcrumbItemProps as PrimerBreadcrumbItemProps,
} from "@primer/components";
import "./Breadcrumbs.scss";

export type Props = PrimerBreadcrumbProps;

function Breadcrumbs({ children }: Props) {
  return (
    <PrimerBreadcrumb className="amp-breadcrumbs">{children}</PrimerBreadcrumb>
  );
}

export default Breadcrumbs;

export type ItemProps = PrimerBreadcrumbItemProps;

function Item(props: ItemProps) {
  return <PrimerBreadcrumb.Item {...props} />;
}

Breadcrumbs.Item = Item;
