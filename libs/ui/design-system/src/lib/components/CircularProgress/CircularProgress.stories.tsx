import type { StoryFn, Meta } from "@storybook/react";
import CircularProgress from "./CircularProgress";

const Story: Meta<typeof CircularProgress> = {
  component: CircularProgress,
  title: "CircularProgress",
};
export default Story;

export const Primary = {
  args: {},
};
