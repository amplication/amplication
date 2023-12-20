import * as React from "react";
import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { TemplateTitle } from "../template/TemplateTitle";

export const ConversationTypeCreate = (
  props: CreateProps
): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Key" source="key" />
        <ReferenceInput
          source="template.id"
          reference="Template"
          label="Template"
        >
          <SelectInput optionText={TemplateTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
