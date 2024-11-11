import React from "react";
import { Meta } from "@storybook/react";
import { ColorPicker } from "./ColorPicker";

export default {
  title: "ColorPicker",
  component: ColorPicker,
} as Meta;

export const Default = {
  render: (props: any) => {
    const [color, setColor] = React.useState("#fff");

    return <ColorPicker onChange={setColor} selectedColor={color} />;
  },
};
