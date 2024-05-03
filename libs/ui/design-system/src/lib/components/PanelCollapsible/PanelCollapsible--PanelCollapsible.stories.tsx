import type { StoryFn, Meta } from "@storybook/react";
import { PanelCollapsible } from "./PanelCollapsible";

const Story: Meta<typeof PanelCollapsible> = {
  component: PanelCollapsible,
  title: "PanelCollapsible",
};
export default Story;

export const Primary = {
  args: {},
};
