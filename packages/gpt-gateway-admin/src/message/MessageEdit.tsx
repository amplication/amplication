import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";

import { TemplateTitle } from "../template/TemplateTitle";

export const MessageEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
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
    </Edit>
  );
};
