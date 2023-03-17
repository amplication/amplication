import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectMenuList } from "./SelectMenu";

const Story: ComponentMeta<typeof SelectMenuList> = {
  component: SelectMenuList,
  title: "SelectMenuList",
};
export default Story;

const Template: ComponentStory<typeof SelectMenuList> = (args) => (
  <SelectMenuList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
