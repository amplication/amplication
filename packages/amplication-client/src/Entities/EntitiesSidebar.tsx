import React, { useCallback } from "react";
import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";
import Tools from "./Tools";
import "./EntitiesSidebar.scss";
import { useRouteMatch, useHistory } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

enum SidebarTab {
  Tools,
  Preferences,
}

const EntitiesSidebar = ({ children }: Props) => {
  const history = useHistory();
  const match = useRouteMatch<{ application: string }>(
    "/:application/entities/"
  );
  if (!match) {
    throw new Error("Sidebar was rendered outside of entities view");
  }
  const { application } = match?.params;
  const activeTab = match.isExact ? SidebarTab.Tools : SidebarTab.Preferences;

  const handleActivate = useCallback(
    (event) => {
      switch (event.detail.index) {
        case SidebarTab.Tools: {
          history.push(`/${application}/entities`);
          return;
        }
        case SidebarTab.Preferences: {
          return;
        }
      }
    },
    [history, application]
  );

  return (
    <div className="entities-side-bar">
      <TabBar activeTabIndex={activeTab} onActivate={handleActivate}>
        <Tab>Tools</Tab>
        <Tab disabled={match.isExact}>Preferences</Tab>
      </TabBar>
      {activeTab === SidebarTab.Tools && <Tools />}
      {activeTab === SidebarTab.Preferences && children}
    </div>
  );
};

export default EntitiesSidebar;
