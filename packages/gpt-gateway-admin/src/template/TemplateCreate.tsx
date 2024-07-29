import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";

import { ConversationTypeTitle } from "../conversationType/ConversationTypeTitle";
import { MessageTitle } from "../message/MessageTitle";
import { ModelTitle } from "../model/ModelTitle";

export const TemplateCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceArrayInput
          source="messageTypes"
          reference="ConversationType"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={ConversationTypeTitle} />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="messages"
          reference="Message"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={MessageTitle} />
        </ReferenceArrayInput>
        <ReferenceInput source="model.id" reference="Model" label="Model">
          <SelectInput optionText={ModelTitle} />
        </ReferenceInput>
        <TextInput label="Name" source="name" />
        <TextInput label="Params" source="params" />
      </SimpleForm>
    </Create>
  );
};
