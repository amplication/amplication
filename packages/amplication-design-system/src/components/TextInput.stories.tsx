import React, { useState } from "react";
import { Meta } from "@storybook/react/types-6-0";
import { TextInput } from "./TextInput";

export default {
  title: "TextInput",
  component: TextInput,
} as Meta;

export const Default = () => {
  return <TextInput  />
}

export const Controlled = () => {
  const [value, setValue] = useState("");
  return <TextInput
    value={value}
    onChange={e=> {
      // @ts-ignore
      setValue(e.target.value)
    }}
  />
}