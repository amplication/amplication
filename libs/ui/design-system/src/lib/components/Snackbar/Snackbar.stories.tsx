import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Snackbar } from "./Snackbar";
import { Button, EnumButtonStyle } from "../Button/Button";

export default {
  title: "Snackbar",
  component: Snackbar,
} as Meta;

export const Default = (props: any) => {
  return <Snackbar open message="Message" />;
};

export const AlwaysOpen = (props: any) => {
  return (
    <Snackbar open message="This message will show indefinitely" timeout={-1} />
  );
};

export const WithIcon = (props: any) => {
  return <Snackbar open message="Message" icon="check" timeout={-1} />;
};

export const WithDismissIcon = (props: any) => {
  return <Snackbar open message="Message" dismissIcon="clock" timeout={-1} />;
};

export const WithCustomAction = (props: any) => {
  return (
    <Snackbar
      action={<Button buttonStyle={EnumButtonStyle.Text}>Click Me</Button>}
      open
      message="Message"
      timeout={-1}
    />
  );
};
