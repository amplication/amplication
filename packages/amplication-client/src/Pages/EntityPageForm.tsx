import React, { useCallback, useState } from "react";
import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";
import * as types from "../types";

type Props = {
  entityPage?: types.EntityPage;
};

enum SidebarTab {
  Properties,
  Display,
}

const EntityPageForm = ({ entityPage }: Props) => {
  const [selectedTab, setSelectedTab] = useState<SidebarTab>(
    SidebarTab.Properties
  );

  const handleActivate = useCallback(
    (event) => {
      setSelectedTab(event.detail.index);
    },
    [setSelectedTab]
  );

  return (
    <div className="entity-page-form">
      <TabBar activeTabIndex={selectedTab} onActivate={handleActivate}>
        <Tab>Properties</Tab>
        <Tab>Display</Tab>
      </TabBar>
      {selectedTab === SidebarTab.Properties && (
        <>
          <div>{entityPage?.id}</div>
          <div>{entityPage?.name}</div>
          <div>{entityPage?.description}</div>
        </>
      )}

      {selectedTab === SidebarTab.Display && "hello Display"}
    </div>
  );
};

export default EntityPageForm;
