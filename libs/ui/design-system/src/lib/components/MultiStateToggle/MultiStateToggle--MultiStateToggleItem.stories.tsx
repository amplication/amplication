import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { MultiStateToggleItem } from "./MultiStateToggle";

const Story: ComponentMeta<typeof MultiStateToggleItem> = {
  component: MultiStateToggleItem,
  title: "MultiStateToggleItem",
};
export default Story;

const Template: ComponentStory<typeof MultiStateToggleItem> = (args) => (
  <MultiStateToggleItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
