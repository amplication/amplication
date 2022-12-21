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
import { ORGANIZATION_TITLE_FIELD } from "../organization/OrganizationTitle";

export const CustomerList = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"The Customers"}
      perPage={50}
      pagination={<Pagination />}
    >
      <Datagrid rowClick="show">
        <TextField label="Id" source="id" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField label="Email" source="email" />
        <TextField label="First Name" source="firstName" />
        <TextField label="Last Name" source="lastName" />
        <BooleanField label="VIP" source="isVip" />
        <TextField label="Birth Data" source="birthData" />
        <TextField
          label="Average Sale (-1500.00 - 1500.00)"
          source="averageSale"
        />
        <TextField label="Favorite Number (1 - 20)" source="favoriteNumber" />
        <TextField label="Geographic Location" source="geoLocation" />
        <TextField label="Comments (up to 500 characters)" source="comments" />
        <TextField
          label="Favorite Colors (multi-select)"
          source="favoriteColors"
        />
        <TextField label="Customer Type" source="customerType" />
        <ReferenceField
          label="Organization"
          source="organization.id"
          reference="Organization"
        >
          <TextField source={ORGANIZATION_TITLE_FIELD} />
        </ReferenceField>
        <ReferenceField
          label="VIP Organization"
          source="organization.id"
          reference="Organization"
        >
          <TextField source={ORGANIZATION_TITLE_FIELD} />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};
