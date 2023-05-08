import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import SearchField from "./SearchField";

const Story: ComponentMeta<typeof SearchField> = {
  title: "SearchField",
  component: SearchField,
  argTypes: { onChange: { action: "change" } },
};
export default Story;

export const Primary: ComponentStory<typeof SearchField> = (props: any) => {
  return <SearchField {...props} />;
};

Primary.args = {
  label: "Search",
  placeholder: "search",
};
