import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectField } from "./SelectField";

const Story: ComponentMeta<typeof SelectField> = {
  component: SelectField,
  title: "SelectField",
};
export default Story;

const Template: ComponentStory<typeof SelectField> = (args) => (
  <SelectField {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
