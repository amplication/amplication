import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { FullScreenLoader } from "./FullScreenLoader";

const Story: ComponentMeta<typeof FullScreenLoader> = {
  component: FullScreenLoader,
  title: "FullScreenLoader",
};
export default Story;

const Template: ComponentStory<typeof FullScreenLoader> = (args) => (
  <FullScreenLoader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
