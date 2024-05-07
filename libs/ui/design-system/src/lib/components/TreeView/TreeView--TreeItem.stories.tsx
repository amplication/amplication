import type { StoryFn, Meta } from "@storybook/react";
import { TreeItem } from "./TreeView";

const Story: Meta<typeof TreeItem> = {
  component: TreeItem,
  title: "TreeItem",
};
export default Story;

export const Primary = {
  args: {},
};
