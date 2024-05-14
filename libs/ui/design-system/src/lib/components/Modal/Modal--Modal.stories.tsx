import type { StoryFn, Meta } from "@storybook/react";
import { Modal } from "./Modal";

const Story: Meta<typeof Modal> = {
  component: Modal,
  title: "Modal",
  argTypes: {
    open: {
      control: "boolean",
    },
  },
};
export default Story;

const Template: StoryFn<typeof Modal> = (args) => (
  <Modal {...args}>
    <p>Lorem ipsum</p>
  </Modal>
);

export const Primary = {
  render: Template,
  args: {},
};
