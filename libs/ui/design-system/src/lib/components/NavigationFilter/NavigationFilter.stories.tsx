import React from "react";
import { Meta } from "@storybook/react";
import { NavigationFilterItem } from "./NavigationFilterItem";
import { NavigationFilter } from "./NavigationFilter";

export default {
  title: "NavigationFilter",
  component: NavigationFilter,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <NavigationFilter>
        <NavigationFilterItem
          tooltip="Click me!"
          onClick={props.onClick}
          selected={false}
        >
          Filter 1
        </NavigationFilterItem>
        <NavigationFilterItem
          tooltip="Click me!"
          onClick={props.onClick}
          selected={false}
        >
          Filter 2
        </NavigationFilterItem>
      </NavigationFilter>
    );
  },
};
