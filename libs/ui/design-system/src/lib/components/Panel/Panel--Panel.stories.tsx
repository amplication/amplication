import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Panel } from "./Panel";

const Story: ComponentMeta<typeof Panel> = {
  component: Panel,
  title: "Panel",
};
export default Story;

const Template: ComponentStory<typeof Panel> = (args) => <Panel {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
