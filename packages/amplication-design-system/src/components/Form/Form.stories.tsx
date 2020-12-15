import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Formik } from "formik";
import { Form, EnumFormStyle } from "./Form";
import { FormHeader } from "./FormHeader";
import { Button, EnumButtonStyle } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { SelectField } from "../SelectField/SelectField";
import { ToggleField } from "../Toggle/ToggleField";
import Page from "../Page/Page";
import MainLayout from "../MainLayout/MainLayout";
import { OptionItem } from "../types";

export default {
  title: "Form",
  component: MainLayout,
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
    <MainLayout>
      <MainLayout.Content>
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
      </MainLayout.Content>
    </MainLayout>
  );
};

export const WithHeader = (props: any) => {
  return (
    <MainLayout>
      <MainLayout.Content>
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
                  <Button buttonStyle={EnumButtonStyle.Secondary}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </FormHeader>
              }
            >
              <TextField name="name" label="Name" />
              <TextField name="description" textarea label="Description" />
              <SelectField label="Color" name="color" options={OPTIONS} />
              <ToggleField name="required" label="Required Field" />
              <TextField name="lastName" label="Last Name" />
            </Form>
          </Formik>
        </Page>
      </MainLayout.Content>
    </MainLayout>
  );
};

export const Horizontal = (props: any) => {
  return (
    <MainLayout>
      <MainLayout.Content>
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
            <Form formStyle={EnumFormStyle.Horizontal}>
              <TextField name="name" label="Name" />
              <TextField name="description" textarea label="Description" />
              <SelectField label="Color" name="color" options={OPTIONS} />
              <ToggleField name="required" label="Required Field" />
              <TextField name="lastName" label="Last Name" />
            </Form>
          </Formik>
        </Page>
      </MainLayout.Content>
    </MainLayout>
  );
};

export const HorizontalWithHeader = (props: any) => {
  return (
    <MainLayout>
      <MainLayout.Content>
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
              formStyle={EnumFormStyle.Horizontal}
              formHeaderContent={
                <FormHeader title="Form Title">
                  <Button buttonStyle={EnumButtonStyle.Secondary}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </FormHeader>
              }
            >
              <TextField name="name" label="Name" />
              <TextField name="description" textarea label="Description" />
              <SelectField label="Color" name="color" options={OPTIONS} />
              <ToggleField name="required" label="Required Field" />
              <TextField name="lastName" label="Last Name" />
            </Form>
          </Formik>
        </Page>
      </MainLayout.Content>
    </MainLayout>
  );
};
