import React from "react";
import { isMobileOnly } from "react-device-detect";

import classNames from "classnames";
import "./MainLayout.scss";

export type Props = {
  children: React.ReactNode;
  className?: string;
};

function MainLayout({ children, className }: Props) {
  return (
    <div
      className={classNames("main-layout", className, {
        "main-layout--mobile": isMobileOnly,
      })}
    >
      {children}
    </div>
  );
}

export type LayoutContentProps = {
  children?: React.ReactNode;
};

const LayoutContent = ({ children }: LayoutContentProps) => {
  return <div className="main-layout__content">{children}</div>;
};

MainLayout.Content = LayoutContent;

export default MainLayout;
