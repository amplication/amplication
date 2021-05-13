import * as React from "react";
import { Show, SimpleShowLayout, ListProps } from "react-admin";

declare const FIELDS: React.ReactElement[];

export const ENTITY_SHOW = (props: ListProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>{FIELDS}</SimpleShowLayout>
    </Show>
  );
};
