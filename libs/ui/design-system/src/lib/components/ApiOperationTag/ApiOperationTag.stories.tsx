import type { Meta } from "@storybook/react";

import { ApiOperationTag, Props } from "./ApiOperationTag";
import { FlexItem, EnumFlexDirection } from "../FlexItem/FlexItem";

const meta: Meta<typeof ApiOperationTag> = {
  title: "ApiOperationTag",
  component: ApiOperationTag,
};

export default meta;

export const Default = {
  render: (props: Props) => {
    return <ApiOperationTag {...props} />;
  },
};
