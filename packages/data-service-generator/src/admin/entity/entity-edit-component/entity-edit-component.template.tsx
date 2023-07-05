import * as React from "react";
import { Edit, SimpleForm, EditProps } from "react-admin";

declare const INPUTS: React.ReactElement[];

export const COMPONENT_NAME = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>{INPUTS}</SimpleForm>
    </Edit>
  );
};
