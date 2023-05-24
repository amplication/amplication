import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { componentNode } from "./Toggle";

const Story: ComponentMeta<typeof componentNode> = {
  component: componentNode,
  title: "componentNode",
};
export default Story;

const Template: ComponentStory<typeof componentNode> = (args) => (
  <componentNode {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
