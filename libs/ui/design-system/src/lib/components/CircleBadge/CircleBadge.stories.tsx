import React from "react";
import { Meta } from "@storybook/react";
import { CircleBadge } from "./CircleBadge";

export default {
  title: "CircleBadge",
  component: CircleBadge,
  argTypes: {
    color: { control: "color" },
  },
} as Meta;

export const Default = (args: any) => {
  return <CircleBadge name="Amplication" {...args} />;
};
