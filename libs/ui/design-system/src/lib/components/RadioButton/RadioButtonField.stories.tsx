import React from "react";
import { Formik } from "formik";
import { Meta } from "@storybook/react/types-6-0";
import { RadioButtonField } from "./RadioButtonField";

export default {
  title: "RadioButton",
  argTypes: { onChange: { action: "change" } },
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
              onChange={props.onChange}
            />
            <RadioButtonField
              name="radioName"
              value="Option2"
              label="Option 2"
              onChange={props.onChange}
            />
          </>
        );
      }}
    </Formik>
  );
};

export const Disabled = (props: any) => {
  return (
    <Formik initialValues={{ radioName: "Option1" }} onSubmit={() => {}}>
      {(formik) => {
        return (
          <>
            <RadioButtonField
              disabled
              name="radioName"
              value="Option1"
              label="Option 1"
              onChange={props.onChange}
            />
            <RadioButtonField
              disabled
              name="disabledradioName"
              value="Option2"
              label="Option 2"
              onChange={props.onChange}
            />
          </>
        );
      }}
    </Formik>
  );
};
