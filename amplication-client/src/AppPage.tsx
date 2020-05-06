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
import keyBy from "lodash.keyby";
import "./AppPage.css";

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
    <div className="app">
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
        <main>
          <header>
            <h1>{app.name}</h1>
            <p>{app.description}</p>
            <TabBar activeTabIndex={activeTabIndex} onActivate={handleActivate}>
              <Tab>Versions</Tab>
              <Tab>Environment</Tab>
            </TabBar>
          </header>
          {activeTabIndex === 0 && (
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
                            {version.date.toLocaleDateString()}
                          </DataTableCell>
                          <DataTableCell>{version.description}</DataTableCell>
                        </DataTableRow>
                      );
                    })}
                  </DataTableBody>
                </DataTableContent>
              </DataTable>
            </Card>
          )}
          {activeTabIndex === 1 &&
            app.environments.map((environment) => (
              <div>
                <h2>{environment.name}</h2>
                {environment.versions.map((version) => (
                  <div>
                    {version.id} {version.date.toLocaleDateString()}{" "}
                    {version.description}
                  </div>
                ))}
              </div>
            ))}
        </main>
      )}
    </div>
  );
}

export default AppPage;

function getMockData(appId: string) {
  const data = apps.find((app) => app.id === appId);
  if (!data) {
    return;
  }
  const versionsById = keyBy(
    data.versions.map((version) => ({
      ...version,
      date: new Date(version.date),
    })),
    (version: { id: string }) => version.id
  );
  return {
    ...data,
    versions: Object.values(versionsById),
    environments: data.environments.map((environment) => ({
      ...environment,
      versions: environment.versions.map((version) => versionsById[version.id]),
    })),
  };
}
