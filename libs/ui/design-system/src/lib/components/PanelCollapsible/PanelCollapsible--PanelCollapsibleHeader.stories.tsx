import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { PanelCollapsibleHeader } from "./PanelCollapsible";

const Story: ComponentMeta<typeof PanelCollapsibleHeader> = {
  component: PanelCollapsibleHeader,
  title: "PanelCollapsibleHeader",
};
export default Story;

const Template: ComponentStory<typeof PanelCollapsibleHeader> = (args) => (
  <PanelCollapsibleHeader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
