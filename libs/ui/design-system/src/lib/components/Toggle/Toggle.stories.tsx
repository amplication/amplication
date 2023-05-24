import React from "react";
import { Meta } from "@storybook/react";
import { Toggle } from "./Toggle";

export default {
  title: "Toggle",
  argTypes: { onValueChange: { action: "valueChange" } },
  component: Toggle,
} as Meta;

export const Default = (props: any) => {
  return (
    <Toggle
      label="Toggle Label"
      title="Toggle Title"
      onValueChange={props.onValueChange}
      checked={false}
    />
  );
};
export const Checked = (props: any) => {
  return (
    <Toggle
      label="Toggle Label"
      title="Toggle Title"
      onValueChange={props.onValueChange}
      checked
    />
  );
};
