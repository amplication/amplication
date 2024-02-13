import * as React from "react";
import { Show, SimpleShowLayout } from "react-admin";

declare const FIELDS: React.ReactElement[];

export const ENTITY_SHOW = (): React.ReactElement => {
  return (
    <Show>
      <SimpleShowLayout>{FIELDS}</SimpleShowLayout>
    </Show>
  );
};
