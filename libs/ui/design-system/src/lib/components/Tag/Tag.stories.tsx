import type { Meta } from "@storybook/react";

import { Tag, Props } from "./Tag";
import { FlexItem, EnumFlexDirection } from "../FlexItem/FlexItem";
import { COLORS } from "../ColorPicker/ColorPicker";

const meta: Meta<typeof Tag> = {
  title: "Tag",
  component: Tag,
};

export default meta;

export const Default = {
  render: (props: Props) => {
    return (
      <FlexItem direction={EnumFlexDirection.Column}>
        {COLORS.map((color) => (
          <Tag color={color} value="my tag" />
        ))}
      </FlexItem>
    );
  },
};
