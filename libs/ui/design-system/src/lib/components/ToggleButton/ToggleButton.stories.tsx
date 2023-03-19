import React from "react";
import { Meta } from "@storybook/react";
import { ToggleButton } from "./ToggleButton";

export default {
  title: "ToggleButton",
  argTypes: { onClick: { action: "click" } },
  component: ToggleButton,
} as Meta;

export const Default = (props: any) => {
  return (
    <ToggleButton label="Click me!" onClick={props.onClick} selected={false} />
  );
};
export const Selected = (props: any) => {
  return <ToggleButton label="Click me!" onClick={props.onClick} selected />;
};
