import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectMenuItem } from "./SelectMenu";

const Story: ComponentMeta<typeof SelectMenuItem> = {
  component: SelectMenuItem,
  title: "SelectMenuItem",
};
export default Story;

const Template: ComponentStory<typeof SelectMenuItem> = (args) => (
  <SelectMenuItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
