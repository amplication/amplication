import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { CodeEditor } from "./CodeEditor";

const Story: ComponentMeta<typeof CodeEditor> = {
  component: CodeEditor,
  title: "CodeEditor",
};
export default Story;

const Template: ComponentStory<typeof CodeEditor> = (args) => (
  <CodeEditor {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
