import React from "react";

import { SelectField } from "./SelectField";
import { Form, Formik } from "formik";
import { OptionItem } from "../types";
import { Meta } from "@storybook/react";

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

export const Default = {
  render: (args: any) => {
    return (
      <Formik initialValues={[]} onSubmit={() => {}}>
        <Form>
          <SelectField label="Label" name="name" options={OPTIONS} {...args} />
        </Form>
      </Formik>
    );
  },
};
