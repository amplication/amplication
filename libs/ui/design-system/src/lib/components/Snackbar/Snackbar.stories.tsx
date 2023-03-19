import React from "react";
import { Meta } from "@storybook/react";
import { Snackbar } from "./Snackbar";
import { Button, EnumButtonStyle } from "../Button/Button";
import { Alert } from "@mui/material";

export default {
  title: "Snackbar",
  component: Snackbar,
} as Meta;

export const AlwaysOpen = (props: any) => {
  return (
    <Snackbar
      open
      message="This message will show indefinitely"
      autoHideDuration={-1}
    />
  );
};

export const WithIcon = (props: any) => {
  return (
    <Snackbar open message="Message" autoHideDuration={-1}>
      <Alert severity="info">This is an information message!</Alert>
    </Snackbar>
  );
};

export const WithCustomAction = (props: any) => {
  return (
    <Snackbar
      action={<Button buttonStyle={EnumButtonStyle.Text}>Click Me</Button>}
      open
      message="Message"
      autoHideDuration={-1}
    />
  );
};
