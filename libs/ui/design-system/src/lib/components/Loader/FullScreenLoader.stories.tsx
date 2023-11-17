import type { StoryFn, Meta } from "@storybook/react";
import { FullScreenLoader } from "./FullScreenLoader";

const Story: Meta<typeof FullScreenLoader> = {
  component: FullScreenLoader,
  title: "FullScreenLoader",
};
export default Story;

export const Primary = {
  args: {},
};
