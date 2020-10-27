import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { TextInput } from "./TextInput";
/** @todo add this to every story automatically */
import "../index.scss";

export default {
  title: "TextInput",
  component: TextInput,
} as Meta;

export const Default = () => {
  return <TextInput value="Hello" />
}