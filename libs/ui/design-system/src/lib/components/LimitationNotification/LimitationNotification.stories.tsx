import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Router } from "react-router-dom";
import { LimitationNotification } from "./LimitationNotification";
import { createBrowserHistory } from "history";

const Story: ComponentMeta<typeof LimitationNotification> = {
  component: LimitationNotification,
  title: "LimitationNotification",
};
export default Story;
const history = createBrowserHistory();

const Template: ComponentStory<typeof LimitationNotification> = (args) => (
  <Router history={history}>
    <LimitationNotification {...args} />
  </Router>
);

export const Primary = Template.bind({});
Primary.args = {};
