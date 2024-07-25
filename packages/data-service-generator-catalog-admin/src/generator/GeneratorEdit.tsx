import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  BooleanInput,
} from "react-admin";

import { VersionTitle } from "../version/VersionTitle";

export const GeneratorEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="Name" source="name" />
        <TextInput label="FullName" source="fullName" />
        <ReferenceArrayInput
          source="version"
          reference="Version"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={VersionTitle} />
        </ReferenceArrayInput>
        <BooleanInput label="IsActive" source="isActive" />
      </SimpleForm>
    </Edit>
  );
};
