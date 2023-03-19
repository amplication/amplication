import React from "react";
import { Meta } from "@storybook/react";
import { ToggleField } from "./ToggleField";
import { Form, Formik } from "formik";

export default {
  title: "ToggleField",
  component: ToggleField,
} as Meta;

export const Default = (props: any) => {
  return (
    <Formik initialValues={{ required: false }} onSubmit={() => {}}>
      <Form>
        <ToggleField name="required" label="Required Field" />
      </Form>
    </Formik>
  );
};
