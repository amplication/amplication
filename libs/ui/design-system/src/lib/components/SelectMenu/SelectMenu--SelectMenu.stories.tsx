import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectMenu } from "./SelectMenu";

const Story: ComponentMeta<typeof SelectMenu> = {
  component: SelectMenu,
  title: "SelectMenu",
};
export default Story;

const Template: ComponentStory<typeof SelectMenu> = (args) => (
  <SelectMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
