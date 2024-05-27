import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  DateTimeInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
} from "react-admin";

import { GeneratorTitle } from "../generator/GeneratorTitle";

export const VersionCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
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
    </Create>
  );
};
