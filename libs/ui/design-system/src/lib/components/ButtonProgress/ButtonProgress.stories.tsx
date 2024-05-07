import React from "react";
import { Meta } from "@storybook/react";
import { ButtonProgress, Props } from "./ButtonProgress";
import { EnumFlexDirection, FlexItem } from "../FlexItem/FlexItem";

export default {
  title: "ButtonProgress",
  component: ButtonProgress,
} as Meta;

export const Default = {
  render: (args: Props) => {
    return (
      <ButtonProgress
        {...args}
        progress={args.progress || 100}
        leftValue={args.leftValue || "some progress"}
      >
        ButtonProgress
      </ButtonProgress>
    );
  },
};

export const All = {
  render: (args: Props) => {
    return (
      <>
        <FlexItem direction={EnumFlexDirection.Column}>
          <ButtonProgress
            progress={100}
            yellowColorThreshold={50}
            redColorThreshold={1}
            leftValue="some progress"
          >
            default
          </ButtonProgress>
          <ButtonProgress
            progress={50}
            leftValue="some progress"
            yellowColorThreshold={50}
            redColorThreshold={1}
          >
            warning
          </ButtonProgress>
          <ButtonProgress
            progress={0}
            leftValue="some progress"
            yellowColorThreshold={50}
            redColorThreshold={1}
          >
            danger
          </ButtonProgress>
        </FlexItem>
      </>
    );
  },
};
