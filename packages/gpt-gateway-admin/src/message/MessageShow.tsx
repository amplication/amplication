import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  ShowProps,
  TextField,
  DateField,
  ReferenceField,
} from "react-admin";
import { TEMPLATE_TITLE_FIELD } from "../template/TemplateTitle";

export const MessageShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
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
      </SimpleShowLayout>
    </Show>
  );
};
