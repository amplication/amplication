import type { StoryFn, Meta } from "@storybook/react";
import PlanUpgradeConfirmation from "./PlanUpgradeConfirmation";

const Story: Meta<typeof PlanUpgradeConfirmation> = {
  title: "PlanUpgradeConfirmation",
  component: PlanUpgradeConfirmation,
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
