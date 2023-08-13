import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react";
import { ConfirmationDialog } from "./ConfirmationDialog";

export default {
  title: "ConfirmationDialog",
  argTypes: {
    onDismiss: { action: "dismiss" },
    onConfirm: { action: "confirm" },
  },
  component: ConfirmationDialog,
} as Meta;

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

export const Default = (props: any) => {
  return (
    <Formik initialValues={{ checkboxListName: [] }} onSubmit={() => {}}>
      {(formik) => {
        return (
          <ConfirmationDialog
            isOpen
            title="Delete record"
            confirmButton={CONFIRM_BUTTON}
            dismissButton={DISMISS_BUTTON}
            message="Are you sure you want to delete?"
            onConfirm={props.onConfirm}
            onDismiss={props.onDismiss}
          />
        );
      }}
    </Formik>
  );
};
