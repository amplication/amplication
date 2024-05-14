import type { StoryFn, Meta } from "@storybook/react";
import { Loader } from "./Loader";

const Story: Meta<typeof Loader> = {
  component: Loader,
  title: "Loader",
};
export default Story;

export const Primary = {
  args: {},
};
