import type { Meta } from "@storybook/react";

import { Chip, EnumChipStyle, Props } from "./Chip";
import { FlexItem, EnumFlexDirection } from "../FlexItem/FlexItem";

const meta: Meta<typeof Chip> = {
  title: "Chip",
  component: Chip,
};

export default meta;

export const Default = {
  render: (props: Props) => {
    return (
      <FlexItem direction={EnumFlexDirection.Column}>
        <Chip chipStyle={props.chipStyle} className={props.className}>
          Default Chip
        </Chip>
      </FlexItem>
    );
  },
};
