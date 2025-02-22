import classNames from "classnames";
import React from "react";
import "./OuterPageLayout.scss";
type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  menu: React.ReactNode;
};

const CLASS_NAME = "amp-outer-page-layout";

function OuterPageLayout({ children, className, menu }: Props) {
  return (
    <>
      <div className={classNames(CLASS_NAME, className)}>
        {menu}

        <div className={`${CLASS_NAME}__body`}>{children}</div>
      </div>
    </>
  );
}

export default OuterPageLayout;
