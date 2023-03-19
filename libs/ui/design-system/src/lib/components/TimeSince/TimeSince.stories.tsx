import React from "react";
import { Meta } from "@storybook/react";
import { TimeSince, EnumTimeSinceSize } from "./TimeSince";

export default {
  title: "TimeSince",
  component: TimeSince,
} as Meta;

const SAMPLE_DATE = new Date();
SAMPLE_DATE.setHours(SAMPLE_DATE.getHours() - 2);

export const Default = (props: any) => {
  return <TimeSince time={SAMPLE_DATE} />;
};

export const Short = (props: any) => {
  return <TimeSince time={SAMPLE_DATE} size={EnumTimeSinceSize.short} />;
};
