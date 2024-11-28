import React from "react";
import { Meta } from "@storybook/react";
import { NavigationHeader } from "./NavigationHeader";

export default {
  title: "NavigationHeader",
  component: NavigationHeader,
} as Meta;

export const Default = {
  render: (props: any) => {
    return <NavigationHeader>this is the header</NavigationHeader>;
  },
};
