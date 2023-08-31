import * as React from "react";
import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  DateTimeInput,
  BooleanInput,
} from "react-admin";

export const VersionEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="Changelog" multiline source="changelog" />
        <DateTimeInput label="DeletedAt" source="deletedAt" />
        <BooleanInput label="Deprecated" source="deprecated" />
        <TextInput label="Name" source="name" />
      </SimpleForm>
    </Edit>
  );
};
