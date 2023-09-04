import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { PanelCollapsible } from "./PanelCollapsible";

const Story: ComponentMeta<typeof PanelCollapsible> = {
  component: PanelCollapsible,
  title: "PanelCollapsible",
};
export default Story;

const Template: ComponentStory<typeof PanelCollapsible> = (args) => (
  <PanelCollapsible {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
