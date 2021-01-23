import React from "react";
import "./PageContent.scss";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  className?: string;
};

const CLASS_NAME = "amp-page-content";

function PageContent({ children, sideContent, className }: Props) {
  return (
    <div className={classNames(CLASS_NAME, className)}>
      {sideContent && <div className={`${CLASS_NAME}_tabs`}>{sideContent}</div>}
      <main className={`${CLASS_NAME}_main`}>{children}</main>
    </div>
  );
}

export default PageContent;
