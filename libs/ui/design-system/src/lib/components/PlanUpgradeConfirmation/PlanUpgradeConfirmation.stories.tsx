import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { PlanUpgradeConfirmation } from "./PlanUpgradeConfirmation";

const Story: ComponentMeta<typeof PlanUpgradeConfirmation> = {
  component: PlanUpgradeConfirmation,
  title: "PlanUpgradeConfirmation",
};
export default Story;

const Template: ComponentStory<typeof PlanUpgradeConfirmation> = (args) => (
  <PlanUpgradeConfirmation {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
