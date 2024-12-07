import { Meta } from "@storybook/react";
import { Formik } from "formik";
import Page from "../Page/Page";
import { SelectField } from "../SelectField/SelectField";
import { TextField } from "../TextField/TextField";
import { ToggleField } from "../Toggle/ToggleField";
import { Form } from "../Form/Form";
import { FormColumns } from "./FormColumns";

export default {
  title: "FormColumns",
  component: FormColumns,
} as Meta;

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
            <FormColumns>
              <TextField name="name" label="Name" />
              <TextField name="lastName" label="Last Name" />
              <TextField name="comment" label="comment" />
              <TextField name="comment2" label="comment" />
              <TextField name="description" textarea label="Description" />
            </FormColumns>
            <ToggleField name="required" label="Required Field" />
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
