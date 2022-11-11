import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { CircleBadge } from "./CircleBadge";

export default {
  title: "CircleBadge",
  component: CircleBadge,
  argTypes: {
    color: { control: "color" },
  },
} as Meta;

export const Default = (props: any) => {
  return <CircleBadge name="Amplication" />;
};

export const ChangeColor = (props: any) => {
  return <CircleBadge name="Amplication" color={props.color} />;
};
