import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Page } from "./Page";

const Story: ComponentMeta<typeof Page> = {
  component: Page,
  title: "Page",
};
export default Story;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
