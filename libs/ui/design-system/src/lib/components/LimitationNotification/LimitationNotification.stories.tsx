import type { StoryFn, Meta } from "@storybook/react";
import { Router } from "react-router-dom";
import { LimitationNotification } from "./LimitationNotification";
import { createBrowserHistory } from "history";

const Story: Meta<typeof LimitationNotification> = {
  component: LimitationNotification,
  title: "LimitationNotification",
};
export default Story;
const history = createBrowserHistory();

const Template: StoryFn<typeof LimitationNotification> = (args) => (
  <Router history={history}>
    <LimitationNotification {...args} />
  </Router>
);

export const Primary = {
  render: Template,
  args: {},
};
