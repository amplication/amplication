import * as React from "react";
import { Show, SimpleShowLayout, ShowProps } from "react-admin";

declare const FIELDS: React.ReactElement[];

export const ENTITY_SHOW = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>{FIELDS}</SimpleShowLayout>
    </Show>
  );
};
