import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react/types-6-0";
import { TextField } from "./TextField";

export default {
  title: "TextField",
  component: TextField,
} as Meta;

export const Default = () => {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <TextField name="name" />
    </Formik>
  );
};

export const Textarea = () => {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <TextField name="name" textarea />
    </Formik>
  );
};
