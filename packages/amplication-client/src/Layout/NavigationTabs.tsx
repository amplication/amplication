import React from "react";
import "./NavigationTabs.scss";

const CLASS_NAME = "navigation-tabs";

const NavigationTabs = () => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__tab`}>Tab 1</div>
      <div className={`${CLASS_NAME}__tab ${CLASS_NAME}__tab--selected`}>
        Tab 2
      </div>
      <div className={`${CLASS_NAME}__tab`}>Tab 3</div>
      <div className={`${CLASS_NAME}__tab`}>Tab 4</div>
    </div>
  );
};

export default NavigationTabs;
