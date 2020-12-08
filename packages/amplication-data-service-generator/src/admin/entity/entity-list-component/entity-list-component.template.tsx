import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
// @ts-ignore
import { api } from "../api";
import {
  DataGrid,
  DataField,
  SortData,
  DataGridRow,
  DataGridCell,
  EnumTitleType,
  TimeSince,
  Button,
  CircleIcon,
  EnumCircleIconStyle,
} from "@amplication/design-system";
// @ts-ignore
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";

declare const ENTITY_DISPLAY_NAME: string;
declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const RESOURCE: string;
declare const FIELDS: DataField[];
declare const CELLS: React.ReactElement[];
declare interface ENTITY {
  id: string;
}

type Data = ENTITY[];

const SORT_DATA: SortData = {
  field: null,
  order: null,
};

export const ENTITY_LIST = (): React.ReactElement => {
  const { data, error } = useQuery<Data, Error>(
    `list-${RESOURCE}`,
    async () => {
      const response = await api.get(`/${RESOURCE}`);
      return response.data;
    }
  );

  useBreadcrumbs(`/${RESOURCE}`, ENTITY_PLURAL_DISPLAY_NAME);

  return (
    <>
      <DataGrid
        fields={FIELDS}
        titleType={EnumTitleType.PageTitle}
        title={ENTITY_PLURAL_DISPLAY_NAME}
        loading={false}
        sortDir={SORT_DATA}
        toolbarContentEnd={
          <Link to={`/${RESOURCE}/new`}>
            <Button>Create {ENTITY_DISPLAY_NAME} </Button>
          </Link>
        }
      >
        {data &&
          data.map((item: ENTITY) => {
            return (
              <DataGridRow key={item.id} clickData={item}>
                <DataGridCell>
                  <Link to={`/${RESOURCE}/${item.id}`}>{item.id}</Link>
                </DataGridCell>
                {CELLS}
              </DataGridRow>
            );
          })}
      </DataGrid>

      {error && error.toString()}
    </>
  );
};
