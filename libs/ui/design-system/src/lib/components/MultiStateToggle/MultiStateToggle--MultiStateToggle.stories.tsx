import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { MultiStateToggle } from "./MultiStateToggle";

const Story: ComponentMeta<typeof MultiStateToggle> = {
  component: MultiStateToggle,
  title: "MultiStateToggle",
};
export default Story;

const Template: ComponentStory<typeof MultiStateToggle> = (args) => (
  <MultiStateToggle {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
