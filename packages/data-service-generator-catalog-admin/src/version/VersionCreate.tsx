import * as React from "react";
import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  DateTimeInput,
  BooleanInput,
} from "react-admin";

export const VersionCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Changelog" multiline source="changelog" />
        <DateTimeInput label="DeletedAt" source="deletedAt" />
        <BooleanInput label="IsActive" source="isActive" />
        <BooleanInput label="IsDeprecated" source="isDeprecated" />
        <TextInput label="Name" source="name" />
      </SimpleForm>
    </Create>
  );
};
