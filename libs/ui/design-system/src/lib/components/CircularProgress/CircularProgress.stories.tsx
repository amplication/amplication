import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { CircularProgress } from "./CircularProgress";

const Story: ComponentMeta<typeof CircularProgress> = {
  component: CircularProgress,
  title: "CircularProgress",
};
export default Story;

const Template: ComponentStory<typeof CircularProgress> = (args) => (
  <CircularProgress {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
