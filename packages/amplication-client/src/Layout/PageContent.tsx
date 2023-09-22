import React from "react";
import { Helmet } from "react-helmet";
import "./PageContent.scss";
import classNames from "classnames";
import { TabItem } from "./useTabRoutes";
import { Tabs } from "@amplication/ui/design-system";

type Props = {
  children: React.ReactNode;
  sideContent?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  tabs?: TabItem[];
};

const CLASS_NAME = "amp-page-content";

function PageContent({
  children,
  sideContent,
  className,
  pageTitle,
  tabs,
}: Props) {
  return (
    <>
      <Helmet>
        <title>{`Amplication${pageTitle ? ` | ${pageTitle}` : ""}`}</title>
      </Helmet>
      <div className={classNames(CLASS_NAME, className)}>
        {tabs && tabs.length > 0 && (
          <div className={`${CLASS_NAME}__header`}>
            <Tabs>
              {tabs.map((tab) => (
                <Tabs.Tab value="one" label={tab.name} to={tab.url} />
              ))}
            </Tabs>
          </div>
        )}
        <div className={`${CLASS_NAME}_body`}>
          {sideContent}
          {sideContent && (
            <div className={`${CLASS_NAME}__tabs`}>{sideContent}</div>
          )}
          <main className={`${CLASS_NAME}__main`}>{children}</main>
        </div>
      </div>
    </>
  );
}

export default PageContent;
