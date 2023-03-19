import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react";
import { Dialog } from "./Dialog";

export default {
  title: "Dialog",
  argTypes: { onDismiss: { action: "dismiss" } },
  component: Dialog,
} as Meta;

export const Default = (props: any) => {
  return (
    <Formik initialValues={{ checkboxListName: [] }} onSubmit={() => {}}>
      {(formik) => {
        return (
          <Dialog isOpen onDismiss={props.onDismiss} title="Dialog Title">
            Dialog Content
          </Dialog>
        );
      }}
    </Formik>
  );
};
