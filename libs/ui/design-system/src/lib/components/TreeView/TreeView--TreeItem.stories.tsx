import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeItem } from "./TreeView";

const Story: ComponentMeta<typeof TreeItem> = {
  component: TreeItem,
  title: "TreeItem",
};
export default Story;

const Template: ComponentStory<typeof TreeItem> = (args) => (
  <TreeItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
