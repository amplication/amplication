import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { PlanUpgradeConfirmation } from "./PlanUpgradeConfirmation";

const Story: ComponentMeta<typeof PlanUpgradeConfirmation> = {
  title: "PlanUpgradeConfirmation",
  component: PlanUpgradeConfirmation,
  argTypes: {
    isOpen: {
      control: "boolean",
    },
  },
};
export default Story;

const Template: ComponentStory<typeof PlanUpgradeConfirmation> = (args) => (
  <PlanUpgradeConfirmation {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
