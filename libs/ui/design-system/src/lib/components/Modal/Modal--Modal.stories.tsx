import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "./Modal";

const Story: ComponentMeta<typeof Modal> = {
  component: Modal,
  title: "Modal",
  argTypes: {
    open: {
      control: "boolean",
    },
  },
};
export default Story;

const Template: ComponentStory<typeof Modal> = (args) => (
  <Modal {...args}>
    <p>Lorem ipsum</p>
  </Modal>
);

export const Primary = Template.bind({});
Primary.args = {};
