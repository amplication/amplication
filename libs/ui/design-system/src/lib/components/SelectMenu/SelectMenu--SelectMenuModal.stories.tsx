import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SelectMenuModal } from "./SelectMenu";

const Story: ComponentMeta<typeof SelectMenuModal> = {
  component: SelectMenuModal,
  title: "SelectMenuModal",
};
export default Story;

const Template: ComponentStory<typeof SelectMenuModal> = (args) => (
  <SelectMenuModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
