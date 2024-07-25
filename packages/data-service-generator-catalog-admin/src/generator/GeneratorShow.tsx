import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  TextField,
  DateField,
  BooleanField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
} from "react-admin";

import { GENERATOR_TITLE_FIELD } from "./GeneratorTitle";

export const GeneratorShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField label="ID" source="id" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField label="Name" source="name" />
        <TextField label="FullName" source="fullName" />
        <BooleanField label="IsActive" source="isActive" />
        <ReferenceManyField
          reference="Version"
          target="generatorId"
          label="Versions"
        >
          <Datagrid rowClick="show">
            <TextField label="ID" source="id" />
            <DateField source="createdAt" label="Created At" />
            <DateField source="updatedAt" label="Updated At" />
            <TextField label="Name" source="name" />
            <TextField label="Changelog" source="changelog" />
            <BooleanField label="IsDeprecated" source="isDeprecated" />
            <TextField label="DeletedAt" source="deletedAt" />
            <BooleanField label="IsActive" source="isActive" />
            <ReferenceField
              label="Generator"
              source="generator.id"
              reference="Generator"
            >
              <TextField source={GENERATOR_TITLE_FIELD} />
            </ReferenceField>
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
