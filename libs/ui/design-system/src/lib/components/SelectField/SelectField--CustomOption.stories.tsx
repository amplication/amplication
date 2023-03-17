import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { CustomOption } from "./SelectField";

const Story: ComponentMeta<typeof CustomOption> = {
  component: CustomOption,
  title: "CustomOption",
};
export default Story;

const Template: ComponentStory<typeof CustomOption> = (args) => (
  <CustomOption {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
