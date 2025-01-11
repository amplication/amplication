import { EnumTabsStyle, TabItem, Tabs } from "@amplication/ui/design-system";
import classNames from "classnames";
import React from "react";
import "./InnerPageLayout.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  tabs?: TabItem[];
};

const CLASS_NAME = "amp-inner-page-layout";

function InnerPageLayout({ children, className, tabs }: Props) {
  return (
    <>
      <div className={classNames(CLASS_NAME, className)}>
        {tabs && tabs.length > 0 && (
          <div className={`${CLASS_NAME}__header`}>
            <Tabs tabsStyle={EnumTabsStyle.Inner}>
              {tabs.map((tab, index) => (
                <Tabs.Tab key={index} {...tab} />
              ))}
            </Tabs>
          </div>
        )}
        <div className={`${CLASS_NAME}__body`}>{children}</div>
      </div>
    </>
  );
}

export default InnerPageLayout;
