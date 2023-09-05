import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { switchNode } from "./Toggle";

const Story: ComponentMeta<typeof switchNode> = {
  component: switchNode,
  title: "switchNode",
};
export default Story;

const Template: ComponentStory<typeof switchNode> = (args) => (
  <switchNode {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
