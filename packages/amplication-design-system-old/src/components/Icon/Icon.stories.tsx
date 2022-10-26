import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Icon } from "./Icon";

export default {
  title: "Icon",
  component: Icon,
} as Meta;

export const Default = (props: any) => {
  return <Icon icon="arrow_left" />;
};
