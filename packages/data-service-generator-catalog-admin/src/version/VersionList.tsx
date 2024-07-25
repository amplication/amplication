import * as React from "react";

import {
  List,
  Datagrid,
  ListProps,
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
} from "react-admin";

import Pagination from "../Components/Pagination";
import { GENERATOR_TITLE_FIELD } from "../generator/GeneratorTitle";

export const VersionList = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"Versions"}
      perPage={50}
      pagination={<Pagination />}
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
    </List>
  );
};
