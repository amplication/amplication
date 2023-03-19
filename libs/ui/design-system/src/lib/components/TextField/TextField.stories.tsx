import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react";
import { TextField } from "./TextField";

export default {
  title: "TextField",
  argTypes: { onChange: { action: "Changed" } },
  component: TextField,
} as Meta;

export const Default = (props: any) => {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <TextField name="name" onChange={props.onChange} />
    </Formik>
  );
};

export const Textarea = (props: any) => {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <TextField name="name" textarea onChange={props.onChange} />
    </Formik>
  );
};
