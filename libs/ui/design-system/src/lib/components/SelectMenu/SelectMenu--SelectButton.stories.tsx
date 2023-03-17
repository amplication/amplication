import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectButton } from "./SelectMenu";

const Story: ComponentMeta<typeof SelectButton> = {
  component: SelectButton,
  title: "SelectButton",
};
export default Story;

const Template: ComponentStory<typeof SelectButton> = (args) => (
  <SelectButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
