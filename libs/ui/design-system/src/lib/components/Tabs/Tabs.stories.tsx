import React from "react";
import { Meta } from "@storybook/react";
import Tabs from "./Tabs";

export default {
  title: "Tabs",
  component: Tabs,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <Tabs>
        <Tabs.Tab label="Page 1" to="#" />
        <Tabs.Tab label="Page 2" to="#" />
        <Tabs.Tab label="Page 3" to="3" />
      </Tabs>
    );
  },
};
