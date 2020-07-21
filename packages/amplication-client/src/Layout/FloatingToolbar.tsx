import React from "react";
import classNames from "classnames";

import "./FloatingToolbar.scss";
import { HeaderToolbar } from "../util/teleporter";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

function FloatingToolbar({ children, className }: Props) {
  return (
    <div className={classNames("amp-floating-toolbar", className)}>
      <div>Breadcrumbs {">"} Breadcrumbs</div>
      <div>{children}</div>
      <div>
        <HeaderToolbar.Target />
      </div>
    </div>
  );
}

export default FloatingToolbar;
