import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeView } from "./TreeView";

const Story: ComponentMeta<typeof TreeView> = {
  component: TreeView,
  title: "TreeView",
};
export default Story;

const Template: ComponentStory<typeof TreeView> = (args) => (
  <TreeView {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
