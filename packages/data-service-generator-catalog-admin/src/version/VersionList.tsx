import * as React from "react";
import {
  List,
  Datagrid,
  ListProps,
  TextField,
  DateField,
  BooleanField,
} from "react-admin";
import Pagination from "../Components/Pagination";

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
        <TextField label="Changelog" source="changelog" />
        <DateField source="createdAt" label="Created At" />
        <TextField label="DeletedAt" source="deletedAt" />
        <TextField label="ID" source="id" />
        <BooleanField label="IsActive" source="isActive" />
        <BooleanField label="IsDeprecated" source="isDeprecated" />
        <TextField label="Name" source="name" />
        <DateField source="updatedAt" label="Updated At" />
      </Datagrid>
    </List>
  );
};
