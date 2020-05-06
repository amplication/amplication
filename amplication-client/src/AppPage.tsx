import React from "react";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";

function AppPage() {
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
    </>
  );
}

export default AppPage;
