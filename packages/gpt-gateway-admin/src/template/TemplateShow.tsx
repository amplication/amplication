import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  DateField,
  TextField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
} from "react-admin";

import { TEMPLATE_TITLE_FIELD } from "./TemplateTitle";
import { MODEL_TITLE_FIELD } from "../model/ModelTitle";

export const TemplateShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created At" />
        <TextField label="Id" source="id" />
        <ReferenceField label="Model" source="model.id" reference="Model">
          <TextField source={MODEL_TITLE_FIELD} />
        </ReferenceField>
        <TextField label="Name" source="name" />
        <TextField label="Params" source="params" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceManyField
          reference="Message"
          target="templateId"
          label="Messages"
        >
          <Datagrid rowClick="show">
            <TextField label="Content" source="content" />
            <DateField source="createdAt" label="Created At" />
            <TextField label="Id" source="id" />
            <TextField label="Position" source="position" />
            <TextField label="Role" source="role" />
            <ReferenceField
              label="Template"
              source="template.id"
              reference="Template"
            >
              <TextField source={TEMPLATE_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="updatedAt" label="Updated At" />
          </Datagrid>
        </ReferenceManyField>
        <ReferenceManyField
          reference="ConversationType"
          target="templateId"
          label="ConversationTypes"
        >
          <Datagrid rowClick="show">
            <DateField source="createdAt" label="Created At" />
            <TextField label="Id" source="id" />
            <TextField label="Key" source="key" />
            <ReferenceField
              label="Template"
              source="template.id"
              reference="Template"
            >
              <TextField source={TEMPLATE_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="updatedAt" label="Updated At" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
