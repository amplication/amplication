import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { SelectField } from "./SelectField";
import { Form, Formik } from "formik";

export default {
  title: "SelectField",
  component: SelectField,
} as Meta;

export const Default = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={[]} />;
      </Form>
    </Formik>
  );
};

export const Multi = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={[]} isMulti />;
      </Form>
    </Formik>
  );
};

export const Clearable = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={[]} isClearable />;
      </Form>
    </Formik>
  );
};

export const Disabled = () => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={[]} disabled />;
      </Form>
    </Formik>
  );
};
