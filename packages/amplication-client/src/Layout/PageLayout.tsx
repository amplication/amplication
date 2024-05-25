import { TabItem, Tabs } from "@amplication/ui/design-system";
import classNames from "classnames";
import React, { useCallback } from "react";
import "./PageLayout.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  tabs?: TabItem[];
};

const CLASS_NAME = "amp-page-layout";

function PageLayout({ children, className, tabs }: Props) {
  const tabsComponent = useCallback(() => {
    return tabs.map((tab, index) => <Tabs.Tab key={index} {...tab} />);
  }, [tabs]);

  return (
    <>
      <div className={classNames(CLASS_NAME, className)}>
        {tabs && tabs.length > 0 && (
          <div className={`${CLASS_NAME}__header`}>
            <Tabs>{tabsComponent()}</Tabs>
          </div>
        )}
        <div className={`${CLASS_NAME}__body`}>{children}</div>
      </div>
    </>
  );
}

export default PageLayout;
