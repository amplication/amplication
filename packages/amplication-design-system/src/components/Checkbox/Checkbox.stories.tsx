import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react/types-6-0";
import { CheckboxField } from "./CheckboxField";

export default {
  title: "Checkbox",
  argTypes: { onChange: { action: "change" } },
  component: CheckboxField,
} as Meta;

export const Default = (props: any) => {
  return (
    <Formik initialValues={{ checkboxName: true }} onSubmit={() => {}}>
      {(formik) => {
        return (
          <CheckboxField
            name="checkboxName"
            label="Label"
            onChange={props.onChange}
          />
        );
      }}
    </Formik>
  );
};
