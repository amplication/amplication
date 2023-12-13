import React, { useEffect, useState } from "react";
import { Meta } from "@storybook/react";
import { InputTooltip } from "./InputTooltip";
import { TextInput } from "../TextInput/TextInput";

export default {
  title: "InputTooltip",
  component: InputTooltip,
} as Meta;

export const Default = () => {
  return <InputTooltip content="Input tooltip text here" />;
};
