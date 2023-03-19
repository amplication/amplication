import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { LimitationDialog } from "./LimitationDialog";

const Story: ComponentMeta<typeof LimitationDialog> = {
  component: LimitationDialog,
  title: "LimitationDialog",
  argTypes: {
    isOpen: {
      control: "boolean",
    },
  },
};
export default Story;

const Template: ComponentStory<typeof LimitationDialog> = (args) => (
  <LimitationDialog {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
