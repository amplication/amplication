import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  BooleanInput,
  DateInput,
  NumberInput,
  SelectArrayInput,
  SelectInput,
  ReferenceInput,
  ReferenceArrayInput,
} from "react-admin";

import { OrganizationTitle } from "../organization/OrganizationTitle";
import { OrderTitle } from "../order/OrderTitle";

export const CustomerCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Email" source="email" type="email" />
        <TextInput label="First Name" source="firstName" />
        <TextInput label="Last Name" source="lastName" />
        <BooleanInput label="VIP" source="isVip" />
        <DateInput label="Birth Data" source="birthData" />
        <NumberInput
          label="Average Sale (-1500.00 - 1500.00)"
          source="averageSale"
        />
        <NumberInput
          step={1}
          label="Favorite Number (1 - 20)"
          source="favoriteNumber"
        />
        <TextInput label="Geographic Location" source="geoLocation" />
        <TextInput
          label="Comments (up to 500 characters)"
          multiline
          source="comments"
        />
        <SelectArrayInput
          label="Favorite Colors (multi-select)"
          source="favoriteColors"
          choices={[
            { label: "Red", value: "red" },
            { label: "Green", value: "green" },
            { label: "Purple", value: "purple" },
            { label: "yellow", value: "yellow" },
          ]}
          optionText="label"
          optionValue="value"
        />
        <SelectInput
          source="customerType"
          label="Customer Type"
          choices={[
            { label: "Platinum", value: "platinum" },
            { label: "Gold", value: "gold" },
            { label: "Bronze", value: "bronze" },
            { label: "Regular", value: "regular" },
          ]}
          optionText="label"
          allowEmpty
          optionValue="value"
        />
        <ReferenceInput
          source="organization.id"
          reference="Organization"
          label="Organization"
        >
          <SelectInput optionText={OrganizationTitle} />
        </ReferenceInput>
        <ReferenceInput
          source="organization.id"
          reference="Organization"
          label="VIP Organization"
        >
          <SelectInput optionText={OrganizationTitle} />
        </ReferenceInput>
        <ReferenceArrayInput
          source="orders"
          reference="Order"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={OrderTitle} />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
