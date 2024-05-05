import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  TextField,
  DateField,
  ReferenceField,
  BooleanField,
} from "react-admin";

import { GENERATOR_TITLE_FIELD } from "../generator/GeneratorTitle";

export const VersionShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
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
      </SimpleShowLayout>
    </Show>
  );
};
