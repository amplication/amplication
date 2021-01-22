import React from "react";
import "./PageContent.scss";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  className?: string;
  withFloatingBar?: boolean;
};

const CLASS_NAME = "amp-page-content";

function PageContent({
  children,
  sideContent,
  className,
  withFloatingBar = false,
}: Props) {
  return (
    <div
      className={classNames(CLASS_NAME, className, {
        "amp-page-content--with-floating-bar": withFloatingBar,
      })}
    >
      {sideContent && <div className={`${CLASS_NAME}_tabs`}>{sideContent}</div>}
      <main className={`${CLASS_NAME}_main`}>{children}</main>
    </div>
  );
}

export default PageContent;
