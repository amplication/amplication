import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Tooltip } from "./Tooltip";

export default {
  title: "Tooltip",
  component: Tooltip,
} as Meta;

export const Default = (props: any) => {
  return (
    <div>
      <Tooltip>hello</Tooltip>
    </div>
  );
};
