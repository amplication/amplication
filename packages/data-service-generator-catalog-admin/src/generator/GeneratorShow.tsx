import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  DateField,
  TextField,
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
        <DateField source="createdAt" label="Created At" />
        <TextField label="FullName" source="fullName" />
        <TextField label="ID" source="id" />
        <BooleanField label="IsActive" source="isActive" />
        <TextField label="Name" source="name" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceManyField
          reference="Version"
          target="generatorId"
          label="Versions"
        >
          <Datagrid rowClick="show">
            <TextField label="Changelog" source="changelog" />
            <DateField source="createdAt" label="Created At" />
            <TextField label="DeletedAt" source="deletedAt" />
            <ReferenceField
              label="Generator"
              source="generator.id"
              reference="Generator"
            >
              <TextField source={GENERATOR_TITLE_FIELD} />
            </ReferenceField>
            <TextField label="ID" source="id" />
            <BooleanField label="IsActive" source="isActive" />
            <BooleanField label="IsDeprecated" source="isDeprecated" />
            <TextField label="Name" source="name" />
            <DateField source="updatedAt" label="Updated At" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
