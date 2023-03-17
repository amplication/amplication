import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { content } from "./TreeView";

const Story: ComponentMeta<typeof content> = {
  component: content,
  title: "content",
};
export default Story;

const Template: ComponentStory<typeof content> = (args) => (
  <content {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
