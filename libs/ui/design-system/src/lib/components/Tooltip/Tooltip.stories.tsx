import React from "react";
import { Meta } from "@storybook/react";
import { Tooltip } from "./Tooltip";

export default {
  title: "Tooltip",
  component: Tooltip,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <div>
        <Tooltip {...props}>hello</Tooltip>
      </div>
    );
  },
};
