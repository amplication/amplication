import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { PopoverChildren } from "./Popover";

const Story: ComponentMeta<typeof PopoverChildren> = {
  component: PopoverChildren,
  title: "PopoverChildren",
};
export default Story;

const Template: ComponentStory<typeof PopoverChildren> = (args) => (
  <PopoverChildren {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
