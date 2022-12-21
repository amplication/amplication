import * as React from "react";
import {
  List,
  Datagrid,
  ListProps,
  TextField,
  ReferenceField,
  BooleanField,
} from "react-admin";
import Pagination from "../Components/Pagination";
import { USER_TITLE_FIELD } from "./UserTitle";
import { PROFILE_TITLE_FIELD } from "../profile/ProfileTitle";

export const UserList = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"Users"}
      perPage={50}
      pagination={<Pagination />}
    >
      <Datagrid rowClick="show">
        <TextField label="Username" source="username" />
        <TextField label="Roles" source="roles" />
        <TextField label="Id" source="id" />
        <TextField label="Name" source="name" />
        <TextField label="Bio" source="bio" />
        <TextField label="Email" source="email" />
        <TextField label="Age" source="age" />
        <TextField label="Birth Date" source="birthDate" />
        <TextField label="Score" source="score" />
        <ReferenceField label="Manager" source="user.id" reference="User">
          <TextField source={USER_TITLE_FIELD} />
        </ReferenceField>
        <TextField label="Interests" source="interests" />
        <TextField label="Priority" source="priority" />
        <BooleanField label="Is Curious" source="isCurious" />
        <TextField label="Location" source="location" />
        <TextField label="Extended Properties" source="extendedProperties" />
        <ReferenceField label="Profile" source="profile.id" reference="Profile">
          <TextField source={PROFILE_TITLE_FIELD} />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};
