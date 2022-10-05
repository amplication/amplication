import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Button, EnumButtonStyle } from "../Button/Button";

export default {
  title: "Button",
  component: Button,
} as Meta;

export const Default = () => {
  return <Button>Example</Button>;
};

export const Primary = () => {
  return <Button buttonStyle={EnumButtonStyle.Primary}>Example</Button>;
};

export const Secondary = () => {
  return <Button buttonStyle={EnumButtonStyle.Secondary}>Example</Button>;
};

export const Clear = () => {
  return <Button buttonStyle={EnumButtonStyle.Clear}>Example</Button>;
};

export const CallToAction = () => {
  return <Button buttonStyle={EnumButtonStyle.CallToAction}>Example</Button>;
};

export const WithSplit = () => {
  return <Button isSplit />;
};

export const WithSplitAndValue = () => {
  return <Button isSplit splitValue="Example" />;
};

export const WithIcon = () => {
  return <Button icon="info" />;
};
