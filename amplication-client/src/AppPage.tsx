import React, { useState, useCallback } from "react";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import { TabBar, Tab } from "@rmwc/tabs";
import { match } from "react-router-dom";
import { Card } from "@rmwc/card";
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
  DataTableCell,
} from "@rmwc/data-table";

import { apps } from "./mock.json";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/card/dist/mdc.card.css";

function AppPage({ match }: { match: match<{ app: string }> }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleActivate = useCallback(
    (event) => {
      setActiveTabIndex(event.detail.index);
    },
    [setActiveTabIndex]
  );
  const app = getMockData(match.params.app);
  return (
    <>
      <Drawer>
        <DrawerContent>
          <List>
            <ListItem>App</ListItem>
            <ListItem>Data</ListItem>
            <ListItem>Environment</ListItem>
            <ListItem>Workflow</ListItem>
            <ListItem>Connectors</ListItem>
            <ListItem>API</ListItem>
            <ListItem>Settings</ListItem>
          </List>
        </DrawerContent>
      </Drawer>
      {app && (
        <div>
          <h1>{app.name}</h1>
          <p>{app.description}</p>
          <TabBar activeTabIndex={activeTabIndex} onActivate={handleActivate}>
            <Tab>Versions</Tab>
            <Tab>Environment</Tab>
          </TabBar>
          <Card>
            <DataTable>
              <DataTableContent>
                <DataTableHead>
                  <DataTableRow>
                    <DataTableHeadCell>Version</DataTableHeadCell>
                    <DataTableHeadCell>Date</DataTableHeadCell>
                    <DataTableHeadCell>Description</DataTableHeadCell>
                  </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                  {app.versions.map((version) => {
                    return (
                      <DataTableRow>
                        <DataTableCell>{version.id}</DataTableCell>
                        <DataTableCell>
                          {new Date(version.date).toLocaleDateString()}
                        </DataTableCell>
                        <DataTableCell>{version.description}</DataTableCell>
                      </DataTableRow>
                    );
                  })}
                </DataTableBody>
              </DataTableContent>
            </DataTable>
          </Card>
        </div>
      )}
    </>
  );
}

export default AppPage;

function getMockData(appId: string) {
  return apps.find((app) => app.id === appId);
}
