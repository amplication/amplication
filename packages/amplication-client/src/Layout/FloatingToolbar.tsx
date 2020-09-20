import React, { useContext } from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { LockData } from "../VersionControl/LockStatus";
import { Breadcrumb } from "@primer/components";

import "./FloatingToolbar.scss";
import { HeaderToolbar } from "../util/teleporter";
import AppControlToolbar from "../VersionControl/AppControlToolbar";
import BreadcrumbsContext from "../Layout/BreadcrumbsContext";

type Props = {
  children?: React.ReactNode;
  className?: string;
  lockData?: LockData;
};

const CLASS_NAME = "amp-floating-toolbar";

function FloatingToolbar({ children, className, lockData }: Props) {
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
      <AppControlToolbar lockData={lockData} />
    </div>
  );
}

export default FloatingToolbar;
