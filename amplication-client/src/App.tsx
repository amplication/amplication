import React from "react";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarActionItem,
  TopAppBarFixedAdjust,
} from "@rmwc/top-app-bar";
import { Drawer, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";
import "./App.css";

const data = {
  organization: {
    name: "First Organization",
  },
};

function App() {
  return (
    <div className="App">
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarTitle>{data.organization.name}</TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            <TopAppBarActionItem icon="search" />
            <TopAppBarActionItem icon="notifications" />
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
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
    </div>
  );
}

export default App;
