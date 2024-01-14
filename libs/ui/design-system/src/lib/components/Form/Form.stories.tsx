import { Meta } from "@storybook/react";
import { Formik } from "formik";
import Page from "../Page/Page";
import { SelectField } from "../SelectField/SelectField";
import { TextField } from "../TextField/TextField";
import { ToggleField } from "../Toggle/ToggleField";
import { OptionItem } from "../types";
import { Form } from "./Form";

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

export const Default = {
  render: (props: any) => {
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
          <Form>
            <TextField name="name" label="Name" />
            <TextField name="description" textarea label="Description" />
            <SelectField label="Color" name="color" options={OPTIONS} />
            <ToggleField name="required" label="Required Field" />
            <TextField name="lastName" label="Last Name" />
          </Form>
        </Formik>
      </Page>
    );
  },
};

export const WithHeader = {
  render: (props: any) => {
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
          <Form>
            <TextField name="name" label="Name" />
            <TextField name="description" textarea label="Description" />
            <SelectField label="Color" name="color" options={OPTIONS} />
            <ToggleField name="required" label="Required Field" />
            <TextField name="lastName" label="Last Name" />
          </Form>
        </Formik>
      </Page>
    );
  },
};
