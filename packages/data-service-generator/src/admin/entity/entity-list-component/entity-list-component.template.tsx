import * as React from "react";
import { List, Datagrid } from "react-admin";
//@ts-ignore
import Pagination from "../Components/Pagination";

declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const CELLS: React.ReactElement[];

export const ENTITY_LIST = (): React.ReactElement => {
  return (
    <List>
      <Datagrid rowClick="show">{CELLS}</Datagrid>
    </List>
  );
};
