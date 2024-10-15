import type { Meta } from "@storybook/react";

import { VersionTag, Props } from "./VersionTag";

const meta: Meta<typeof VersionTag> = {
  title: "VersionTag",
  component: VersionTag,
};

export default meta;

export const Default = {
  render: (props: Props) => {
    return <VersionTag {...props} />;
  },
};
