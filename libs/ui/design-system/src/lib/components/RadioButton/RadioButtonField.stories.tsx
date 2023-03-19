import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react";
import { RadioButtonField } from "./RadioButtonField";

export default {
  title: "RadioButton",
  argTypes: {
    onChange: { action: "change" },
    disabled: { control: "boolean" },
  },
  component: RadioButtonField,
} as Meta;

export const Default = (props: any) => {
  return (
    <Formik initialValues={{ radioName: "Option1" }} onSubmit={() => {}}>
      {(formik) => {
        return (
          <>
            <RadioButtonField
              name="radioName"
              value="Option1"
              label="Option 1"
              {...props}
            />
            <RadioButtonField
              name="radioName"
              value="Option2"
              label="Option 2"
              {...props}
            />
          </>
        );
      }}
    </Formik>
  );
};
