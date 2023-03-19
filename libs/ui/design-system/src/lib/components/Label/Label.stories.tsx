import { Meta } from "@storybook/react";
import { Label } from "./Label";
import React from "react";

export default {
  title: "Label",
  component: Label,
} as Meta;

const TEXT = "Example text";

export const Normal = () => {
  return <Label text={TEXT} />;
};
export const Error = () => {
  return <Label text={TEXT} type="error" />;
};
