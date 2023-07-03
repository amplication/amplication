import React from "react";
import { Meta } from "@storybook/react";
import CircleIcon, {
  EnumCircleIconSize,
  EnumCircleIconStyle,
} from "./CircleIcon";

export default {
  title: "CircleIcon",
  component: CircleIcon,
  argTypes: {
    size: {
      control: "inline-radio",
      options: Object.values(EnumCircleIconSize),
    },
    style: {
      control: "inline-radio",
      options: Object.values(EnumCircleIconStyle),
    },
  },
} as Meta;

export const Default = (args: any) => {
  return <CircleIcon icon="check" {...args} />;
};
