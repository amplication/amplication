import type { StoryFn, Meta } from "@storybook/react";
import { SkeletonWrapper } from "./SkeletonWrapper";

const Story: Meta<typeof SkeletonWrapper> = {
  component: SkeletonWrapper,
  title: "SkeletonWrapper",
};
export default Story;

export const Primary = {
  args: {},
};
