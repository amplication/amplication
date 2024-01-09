import type { StoryFn, Meta } from "@storybook/react";
import { Page } from "./Page";

const Story: Meta<typeof Page> = {
  component: Page,
  title: "Page",
};
export default Story;

const Template: StoryFn<typeof Page> = (args) => (
  <Page {...args}>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </Page>
);

export const Primary = {
  render: Template,
  args: {},
};
