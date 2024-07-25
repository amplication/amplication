import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  BooleanInput,
} from "react-admin";

import { VersionTitle } from "../version/VersionTitle";

export const GeneratorCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
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
    </Create>
  );
};
