import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import SearchField from "./SearchField";

export default {
  title: "SearchField",
  argTypes: { onChange: { action: "change" } },
  component: SearchField,
} as Meta;

export const Default = (props: any) => {
  return <SearchField {...props} label="Search" placeholder="Search" />;
};
