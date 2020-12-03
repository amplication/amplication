import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react/types-6-0";
import { CheckboxListField } from "./CheckboxListField";

export default {
  title: "CheckboxList",
  argTypes: { onChange: { action: "change" } },
  component: CheckboxListField,
} as Meta;

const OPTIONS = [
  {
    value: "1",
    label: "Option 1",
  },
  {
    value: "2",
    label: "Option 2",
  },
  {
    value: "3",
    label: "Option 3",
  },
];

export const Default = (props: any) => {
  return (
    <Formik initialValues={{ checkboxListName: [] }} onSubmit={() => {}}>
      {(formik) => {
        return (
          <CheckboxListField
            name="checkboxListName"
            onChange={props.onChange}
            options={OPTIONS}
          />
        );
      }}
    </Formik>
  );
};
