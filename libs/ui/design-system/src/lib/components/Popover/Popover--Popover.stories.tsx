import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Popover } from "./Popover";

const Story: ComponentMeta<typeof Popover> = {
  component: Popover,
  title: "Popover",
};
export default Story;

const Template: ComponentStory<typeof Popover> = (args) => (
  <Popover {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
