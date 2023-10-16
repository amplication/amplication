import React from "react";
import { Meta } from "@storybook/react";
import EnabledIndicator from "./EnabledIndicator";

export default {
  title: "EnabledIndicator",
  component: EnabledIndicator,
} as Meta;

export const Default = {
  render: (args: any) => {
    return <EnabledIndicator {...args} />;
  },
};
