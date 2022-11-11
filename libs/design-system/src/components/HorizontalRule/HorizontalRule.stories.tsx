import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { HorizontalRule } from "./HorizontalRule";

export default {
  title: "HorizontalRule",
  component: HorizontalRule,
} as Meta;

export const Default = (props: any) => {
  return <HorizontalRule />;
};
