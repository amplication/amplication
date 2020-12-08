import React, { useContext } from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "@primer/components";
import { HeaderToolbar } from "../util/teleporter";
import BreadcrumbsContext from "../Layout/BreadcrumbsContext";

import "./FloatingToolbar.scss";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const CLASS_NAME = "amp-floating-toolbar";

function FloatingToolbar({ children, className }: Props) {
  const breadcrumbsContext = useContext(BreadcrumbsContext);

  return (
    <div className={classNames(CLASS_NAME, className)}>
      <div>
        <Breadcrumb className={`${CLASS_NAME}__breadcrumbs`}>
          {breadcrumbsContext.breadcrumbsItems.map((item, index, items) => (
            // Use NavLink to prevent reload
            <NavLink to={item.url} key={index}>
              <Breadcrumb.Item
                as="span"
                selected={index + 1 === items.length}
                href={item.url}
              >
                {item.name}
              </Breadcrumb.Item>
            </NavLink>
          ))}
        </Breadcrumb>
      </div>
      <div>{children}</div>
      <HeaderToolbar.Target />
    </div>
  );
}

export default FloatingToolbar;
