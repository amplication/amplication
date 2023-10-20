import type { StoryFn, Meta } from "@storybook/react";
import { CodeEditor } from "./CodeEditor";

const Story: Meta<typeof CodeEditor> = {
  component: CodeEditor,
  title: "CodeEditor",
};
export default Story;

export const Primary = {
  args: {},
};
