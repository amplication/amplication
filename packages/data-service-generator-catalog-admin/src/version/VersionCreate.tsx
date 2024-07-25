import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  BooleanInput,
  DateTimeInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

import { GeneratorTitle } from "../generator/GeneratorTitle";

export const VersionCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Name" source="name" />
        <TextInput label="Changelog" multiline source="changelog" />
        <BooleanInput label="IsDeprecated" source="isDeprecated" />
        <DateTimeInput label="DeletedAt" source="deletedAt" />
        <BooleanInput label="IsActive" source="isActive" />
        <ReferenceInput
          source="generator.id"
          reference="Generator"
          label="Generator"
        >
          <SelectInput optionText={GeneratorTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
