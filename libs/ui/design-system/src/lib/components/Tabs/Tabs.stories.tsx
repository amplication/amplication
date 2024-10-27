import React from "react";
import { Meta } from "@storybook/react";
import Tabs, { EnumTabsStyle } from "./Tabs";

export default {
  title: "Tabs",
  component: Tabs,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <Tabs>
        <Tabs.Tab name="Page 1" to="/" exact />
        <Tabs.Tab name="Page 2" to="/other" exact />
        <Tabs.Tab name="Page 3" to="/another" exact />
      </Tabs>
    );
  },
};

export const Inner = {
  render: (props: any) => {
    return (
      <Tabs tabsStyle={EnumTabsStyle.Inner}>
        <Tabs.Tab name="Page 1" to="/" exact />
        <Tabs.Tab name="Page 2" to="/other" exact />
        <Tabs.Tab name="Page 3" to="/another" exact />
      </Tabs>
    );
  },
};

export const Header = {
  render: (props: any) => {
    return (
      <Tabs tabsStyle={EnumTabsStyle.Header}>
        <Tabs.Tab name="Page 1" to="/" exact />
        <Tabs.Tab name="Page 2" to="/other" exact />
        <Tabs.Tab name="Page 3" to="/another" exact />
      </Tabs>
    );
  },
};
