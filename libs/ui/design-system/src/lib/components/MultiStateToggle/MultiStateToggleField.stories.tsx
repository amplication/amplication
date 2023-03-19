import React from "react";
import { Meta } from "@storybook/react";
import { MultiStateToggleField } from "./MultiStateToggleField";
import { OptionItem } from "../types";
import { Form, Formik } from "formik";

const OPTIONS: OptionItem[] = [
  {
    label: "Yellow",
    value: "Yellow",
  },
  {
    label: "Red",
    value: "Red",
  },
  {
    label: "Blue",
    value: "Blue",
  },
];

export default {
  title: "MultiStateToggleField",
  component: MultiStateToggleField,
} as Meta;

export const Default = (props: any) => {
  return (
    <Formik
      initialValues={{ multiStateFieldName: "Yellow" }}
      onSubmit={() => {}}
    >
      <Form>
        <MultiStateToggleField
          label=""
          name="multiStateFieldName"
          options={OPTIONS}
        />
      </Form>
    </Formik>
  );
};
