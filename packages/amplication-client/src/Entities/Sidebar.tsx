import React, { useCallback } from "react";
import { Drawer } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";
import Tools from "./Tools";
import "./Sidebar.scss";
import { useRouteMatch, useHistory } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

enum SidebarTab {
  Tools,
  Preferences,
}

const Sidebar = ({ children }: Props) => {
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
    <Drawer className="side-bar">
      <TabBar activeTabIndex={activeTab} onActivate={handleActivate}>
        <Tab>Tools</Tab>
        <Tab disabled={match.isExact}>Preferences</Tab>
      </TabBar>
      {activeTab === SidebarTab.Tools && <Tools />}
      {activeTab === SidebarTab.Preferences && children}
    </Drawer>
  );
};

export default Sidebar;
