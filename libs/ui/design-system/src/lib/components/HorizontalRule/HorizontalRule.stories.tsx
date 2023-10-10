import React from "react";
import { Meta } from "@storybook/react";
import { HorizontalRule } from "./HorizontalRule";

export default {
  title: "HorizontalRule",
  component: HorizontalRule,
} as Meta;

export const Default = {
  render: (props: any) => {
    return <HorizontalRule {...props} style={props.style} />;
  },
};
