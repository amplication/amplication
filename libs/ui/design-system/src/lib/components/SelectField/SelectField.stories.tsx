import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { SelectField } from "./SelectField";
import { Form, Formik } from "formik";
import { OptionItem } from "../types";

const Story: ComponentMeta<typeof SelectField> = {
  component: SelectField,
  title: "SelectField",
};

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

const Template: ComponentStory<typeof SelectField> = (args: any) => {
  return (
    <Formik initialValues={[]} onSubmit={() => {}}>
      <Form>
        <SelectField label="Label" name="name" options={OPTIONS} {...args} />
      </Form>
    </Formik>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
