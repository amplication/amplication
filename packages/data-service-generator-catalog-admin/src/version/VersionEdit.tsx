import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  DateTimeInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
} from "react-admin";

import { GeneratorTitle } from "../generator/GeneratorTitle";

export const VersionEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="Changelog" multiline source="changelog" />
        <DateTimeInput label="DeletedAt" source="deletedAt" />
        <ReferenceInput
          source="generator.id"
          reference="Generator"
          label="Generator"
        >
          <SelectInput optionText={GeneratorTitle} />
        </ReferenceInput>
        <BooleanInput label="IsActive" source="isActive" />
        <BooleanInput label="IsDeprecated" source="isDeprecated" />
        <TextInput label="Name" source="name" />
      </SimpleForm>
    </Edit>
  );
};
