import type { StoryFn, Meta } from "@storybook/react";
import { LimitationDialog } from "./LimitationDialog";

const Story: Meta<typeof LimitationDialog> = {
  component: LimitationDialog,
  title: "LimitationDialog",
  argTypes: {
    isOpen: {
      control: "boolean",
    },
  },
};
export default Story;

export const Primary = {
  args: {},
};
