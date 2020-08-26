import React from "react";
import classNames from "classnames";
import { LockData } from "../VersionControl/LockStatus";

import "./FloatingToolbar.scss";
import { HeaderToolbar } from "../util/teleporter";
import AppControlToolbar from "../VersionControl/AppControlToolbar";

type Props = {
  children?: React.ReactNode;
  className?: string;
  lockData?: LockData;
};

function FloatingToolbar({ children, className, lockData }: Props) {
  return (
    <div className={classNames("amp-floating-toolbar", className)}>
      <div>Breadcrumbs {">"} Breadcrumbs</div>
      <div>{children}</div>
      <HeaderToolbar.Target />
      <AppControlToolbar lockData={lockData} />
    </div>
  );
}

export default FloatingToolbar;
