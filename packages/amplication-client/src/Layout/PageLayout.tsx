import { Tabs } from "@amplication/ui/design-system";
import classNames from "classnames";
import React, { useCallback } from "react";
import "./PageLayout.scss";
import { FeatureTabItem } from "../Resource/ResourceHome";
import {
  EntitlementType,
  FeatureControlContainer,
} from "../Components/FeatureControlContainer";
import { FeatureIndicator } from "../Components/FeatureIndicator";

type Props = {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
  tabs?: FeatureTabItem[];
};

const CLASS_NAME = "amp-page-layout";

function PageLayout({ children, className, tabs }: Props) {
  const tabsComponent = useCallback(() => {
    return tabs.map((tab, index) => {
      return tab.license ? (
        <FeatureControlContainer
          key={index}
          featureId={tab.license}
          entitlementType={EntitlementType.Boolean}
          reversePosition={true}
          render={({ icon, disabled }) => (
            <Tabs.Tab
              key={index}
              {...tab}
              disabled={disabled}
              featureTab={true}
              featureIndicator={
                <FeatureIndicator featureName={tab.license} icon={icon} />
              }
            />
          )}
        />
      ) : (
        <Tabs.Tab key={index} {...tab} />
      );
    });
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
