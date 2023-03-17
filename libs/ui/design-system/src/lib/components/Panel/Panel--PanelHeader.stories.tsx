import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { PanelHeader } from "./Panel";

const Story: ComponentMeta<typeof PanelHeader> = {
  component: PanelHeader,
  title: "PanelHeader",
};
export default Story;

const Template: ComponentStory<typeof PanelHeader> = (args) => (
  <PanelHeader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
