import React from "react";
import { Meta } from "@storybook/react";
import { MultiStateToggle } from "./MultiStateToggle";
import { OptionItem } from "../types";

const OPTIONS: OptionItem[] = [
  {
    label: "Yellow",
    value: "Yellow",
  },
  {
    label: "Red",
    value: "Red",
  },
  {
    label: "Blue",
    value: "Blue",
  },
];

export default {
  title: "MultiStateToggle",
  argTypes: { onChange: { action: "change" } },
  component: MultiStateToggle,
} as Meta;

export const Default = (props: any) => {
  return (
    <MultiStateToggle
      label=""
      name="action_"
      options={OPTIONS}
      onChange={props.onChange}
      selectedValue={OPTIONS[0].value}
    />
  );
};
