import React from "react";
import { StoryObj, Meta, StoryFn } from "@storybook/react";
import SearchField from "./SearchField";

const Story: Meta<typeof SearchField> = {
  title: "SearchField",
  component: SearchField,
  argTypes: { onChange: { action: "change" } },
};
export default Story;

export const Primary: StoryObj<typeof SearchField> = {
  render: (props: any) => {
    return <SearchField {...props} />;
  },

  args: {
    label: "Search",
    placeholder: "search",
  },
};
