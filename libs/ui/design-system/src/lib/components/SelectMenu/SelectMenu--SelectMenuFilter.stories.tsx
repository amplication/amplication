import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectMenuFilter } from "./SelectMenu";

const Story: ComponentMeta<typeof SelectMenuFilter> = {
  component: SelectMenuFilter,
  title: "SelectMenuFilter",
};
export default Story;

const Template: ComponentStory<typeof SelectMenuFilter> = (args) => (
  <SelectMenuFilter {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
