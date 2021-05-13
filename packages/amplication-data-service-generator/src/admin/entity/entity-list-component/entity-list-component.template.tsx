import * as React from "react";
import { List, Datagrid, ListProps } from "react-admin";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const CELLS: React.ReactElement[];

export const ENTITY_LIST = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={ENTITY_PLURAL_DISPLAY_NAME}
      perPage={50}
    >
      <Datagrid rowClick="edit">{CELLS}</Datagrid>
    </List>
  );
};
