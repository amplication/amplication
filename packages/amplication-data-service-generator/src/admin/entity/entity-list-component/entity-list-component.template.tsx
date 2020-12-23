import * as React from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
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
  Button,
  Snackbar,
} from "@amplication/design-system";

declare const ENTITY_DISPLAY_NAME: string;
declare const ENTITY_PLURAL_DISPLAY_NAME: string;
declare const PATH: string;
declare const RESOURCE: string;
declare const FIELDS_VALUE: DataField[];
declare const CELLS: React.ReactElement[];
declare interface ENTITY {
  id: string;
}

type Data = ENTITY[];

const SORT_DATA: SortData = {
  field: null,
  order: null,
};

const FIELDS: DataField[] = FIELDS_VALUE;

export const ENTITY_LIST = (): React.ReactElement => {
  const { data, error, isError } = useQuery<Data, AxiosError>(
    `list-${RESOURCE}`,
    async () => {
      const response = await api.get(`${RESOURCE}`);
      return response.data;
    }
  );

  return (
    <>
      <DataGrid
        fields={FIELDS}
        titleType={EnumTitleType.PageTitle}
        title={ENTITY_PLURAL_DISPLAY_NAME}
        loading={false}
        sortDir={SORT_DATA}
        toolbarContentEnd={
          <Link to={`${PATH}/new`}>
            <Button>Create {ENTITY_DISPLAY_NAME} </Button>
          </Link>
        }
      >
        {data &&
          data.map((item: ENTITY) => {
            return (
              <DataGridRow key={item.id} clickData={item}>
                <DataGridCell>
                  <Link className="entity-id" to={`${PATH}/${item.id}`}>
                    {item.id}
                  </Link>
                </DataGridCell>
                {CELLS}
              </DataGridRow>
            );
          })}
      </DataGrid>
      <Snackbar open={isError} message={error?.response?.data?.message} />
    </>
  );
};
