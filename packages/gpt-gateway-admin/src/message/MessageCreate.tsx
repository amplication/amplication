import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";

import { TemplateTitle } from "../template/TemplateTitle";

export const MessageCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Content" source="content" />
        <NumberInput step={1} label="Position" source="position" />
        <SelectInput
          source="role"
          label="Role"
          choices={[
            { label: "User", value: "User" },
            { label: "System", value: "System" },
            { label: "Assistant", value: "Assistant" },
          ]}
          optionText="label"
          optionValue="value"
        />
        <ReferenceInput
          source="template.id"
          reference="Template"
          label="Template"
        >
          <SelectInput optionText={TemplateTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
