import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Transition } from "./Modal";

const Story: ComponentMeta<typeof Transition> = {
  component: Transition,
  title: "Transition",
};
export default Story;

const Template: ComponentStory<typeof Transition> = (args) => (
  <Transition {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
