import type { StoryFn, Meta } from "@storybook/react";
import { TreeView } from "./TreeView";

const Story: Meta<typeof TreeView> = {
  component: TreeView,
  title: "TreeView",
};
export default Story;

export const Primary = {
  args: {},
};
