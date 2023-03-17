import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { SelectField } from "./SelectField";
import { Form, Formik } from "formik";
import { OptionItem } from "../types";
export default {
  title: "SelectField",
  component: SelectField,
} as Meta;

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

export const Default = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={OPTIONS} />
      </Form>
    </Formik>
  );
};

export const Multi = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={OPTIONS} isMulti />
      </Form>
    </Formik>
  );
};

export const Clearable = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={OPTIONS} isClearable />
      </Form>
    </Formik>
  );
};

export const Disabled = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={OPTIONS} disabled />
      </Form>
    </Formik>
  );
};
