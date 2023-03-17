import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { SkeletonWrapper } from "./SkeletonWrapper";

const Story: ComponentMeta<typeof SkeletonWrapper> = {
  component: SkeletonWrapper,
  title: "SkeletonWrapper",
};
export default Story;

const Template: ComponentStory<typeof SkeletonWrapper> = (args) => (
  <SkeletonWrapper {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
