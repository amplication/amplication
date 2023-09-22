import React from "react";
import { Helmet } from "react-helmet";
import "./PageContent.scss";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  className?: string;
  pageTitle?: string;
};

const CLASS_NAME = "amp-page-content";

function PageContent({ children, sideContent, className, pageTitle }: Props) {
  return (
    <>
      <Helmet>
        <title>{`Amplication${pageTitle ? ` | ${pageTitle}` : ""}`}</title>
      </Helmet>
      <div className={classNames(CLASS_NAME, className)}>
        <div className={`${CLASS_NAME}__body`}>
          {sideContent && (
            <div className={`${CLASS_NAME}__side`}>{sideContent}</div>
          )}
          <main className={`${CLASS_NAME}__main`}>{children}</main>
        </div>
      </div>
    </>
  );
}

export default PageContent;
