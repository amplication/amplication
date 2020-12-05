import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import Provider from "../../components/Provider";
import { CircleBadge } from "../CircleBadge/CircleBadge";

export default {
  title: "Menu",
  argTypes: {
    onSignOutClick: { action: "signOutClick" },
    onItemClick: { action: "itemClick" },
  },
  component: Menu,
} as Meta;

export const Default = (props: any) => {
  return (
    <Provider>
      <Menu
        onSignOutClick={props.onSignOutClick}
        logoContent={<CircleBadge name="Amplication" />}
      />
    </Provider>
  );
};

export const WithItems = (props: any) => {
  return (
    <Provider>
      <Menu
        logoContent={<CircleBadge name="Amplication" />}
        onSignOutClick={props.onSignOutClick}
      >
        <MenuItem
          title="Page 1"
          icon="entity_outline"
          onClick={props.onItemClick}
        />
        <MenuItem
          onClick={props.onItemClick}
          title="Page 2"
          icon="pending_changes_outline"
        />
      </Menu>
    </Provider>
  );
};

export const WithBottomItems = (props: any) => {
  return (
    <Provider>
      <Menu
        logoContent={<CircleBadge name="Amplication" />}
        onSignOutClick={props.onSignOutClick}
        bottomContent={
          <MenuItem
            title="Search"
            icon="search_outline"
            onClick={props.onItemClick}
          />
        }
      >
        <MenuItem
          title="Page 1"
          icon="entity_outline"
          onClick={props.onItemClick}
        />
        <MenuItem
          onClick={props.onItemClick}
          title="Page 2"
          icon="pending_changes_outline"
        />
      </Menu>
    </Provider>
  );
};
