import React from "react";
import "./PageLayout.scss";
import classNames from "classnames";
import { TabItem } from "./useTabRoutes";
import { Tabs } from "@amplication/ui/design-system";

type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  tabs?: TabItem[];
};

const CLASS_NAME = "amp-page-layout";

function PageLayout({ children, className, tabs }: Props) {
  return (
    <>
      <div className={classNames(CLASS_NAME, className)}>
        {tabs && tabs.length > 0 && (
          <div className={`${CLASS_NAME}__header`}>
            <Tabs>
              {tabs.map((tab, index) => (
                <Tabs.Tab
                  key={index}
                  label={tab.name}
                  to={tab.url}
                  exact={tab.exact}
                />
              ))}
            </Tabs>
          </div>
        )}
        <div className={`${CLASS_NAME}__body`}>{children}</div>
      </div>
    </>
  );
}

export default PageLayout;
