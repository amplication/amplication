import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { TextInput } from "./TextInput"

export default {
  title: "TextInput",
  component: TextInput,
} as Meta;

export const Default = () => {
  return <TextInput />
}