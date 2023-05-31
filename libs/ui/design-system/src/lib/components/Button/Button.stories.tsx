import React from "react";
import { Meta } from "@storybook/react";
import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
} as Meta;

export const Default = (args: any) => {
  return <Button {...args}>Example</Button>;
};

export const WithIcon = (props: any) => {
  return (
    <Button
      buttonStyle={props.buttonStyle}
      isSplit={props.isSplit}
      splitValue={props.splitValue}
      icon="info"
      iconSize={props.iconSize}
      iconStyle={props.iconStyle}
      iconPosition={props.iconPosition}
      to={props.to}
    >
      Example
    </Button>
  );
};
