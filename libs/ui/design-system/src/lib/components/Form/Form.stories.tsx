import React from "react";
import { Meta } from "@storybook/react";
import { Formik } from "formik";
import { Form, EnumFormStyle } from "./Form";
import { FormHeader } from "./FormHeader";
import { Button, EnumButtonStyle } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { SelectField } from "../SelectField/SelectField";
import { ToggleField } from "../Toggle/ToggleField";
import Page from "../Page/Page";
import { OptionItem } from "../types";

export default {
  title: "Form",
  component: Form,
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

export const Default = (props: any) => {
  return (
    <Page>
      <Formik
        initialValues={{
          name: "name",
          lastName: "last name",
          description: "description",
          color: "Red",
          required: false,
          enabled: false,
        }}
        onSubmit={() => {}}
      >
        <Form formStyle={props.formStyle}>
          <TextField name="name" label="Name" />
          <TextField name="description" textarea label="Description" />
          <SelectField label="Color" name="color" options={OPTIONS} />
          <ToggleField name="required" label="Required Field" />
          <TextField name="lastName" label="Last Name" />
        </Form>
      </Formik>
    </Page>
  );
};

export const WithHeader = (props: any) => {
  return (
    <Page>
      <Formik
        initialValues={{
          name: "name",
          lastName: "last name",
          description: "description",
          color: "Red",
          required: false,
          enabled: false,
        }}
        onSubmit={() => {}}
      >
        <Form
          formHeaderContent={
            <FormHeader title="Form Title">
              <Button buttonStyle={EnumButtonStyle.Clear}>Cancel</Button>
              <Button type="submit">Save</Button>
            </FormHeader>
          }
          formStyle={props.formStyle}
        >
          <TextField name="name" label="Name" />
          <TextField name="description" textarea label="Description" />
          <SelectField label="Color" name="color" options={OPTIONS} />
          <ToggleField name="required" label="Required Field" />
          <TextField name="lastName" label="Last Name" />
        </Form>
      </Formik>
    </Page>
  );
};
