import type { StoryFn, Meta } from "@storybook/react";
import { CodeCompare } from "./CodeCompare";

const Story: Meta<typeof CodeCompare> = {
  component: CodeCompare,
  title: "CodeCompare",
};
export default Story;

export const Primary = {
  render: (args: any) => {
    return (
      <CodeCompare newVersion="Something Old " oldVersion="Something New" />
    );
  },
};
