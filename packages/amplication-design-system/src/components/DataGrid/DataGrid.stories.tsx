/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { DataGrid, EnumTitleType } from "./DataGrid";
import { DataField, SortData } from "./types";
import DataGridRow from "./DataGridRow";
import DataGridCell from "./DataGridCell";

import { Button, EnumButtonStyle } from "../Button/Button";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../SelectMenu/SelectMenu";

export default {
  title: "DataGrid",
  argTypes: {
    onSortChange: { action: "sortChange" },
    onSearchChange: { action: "searchChange" },
    onRowClick: { action: "rowClick" },
  },
  component: DataGrid,
} as Meta;

const FIELDS: DataField[] = [
  {
    name: "id",
    title: "",
    sortable: true,
    minWidth: true,
    icon: "hash",
  },
  {
    name: "firstName",
    title: "First Name",
    sortable: true,
  },
  {
    name: "lastName",
    title: "Last Name",
    sortable: true,
  },
  {
    name: "email",
    title: "Email",
    sortable: true,
  },
  {
    name: "gender",
    title: "Gender",
    sortable: true,
  },
  {
    name: "ipAddress",
    title: "IPv4 (Internet Protocol address)",
    sortable: true,
  },
];

const SORT_DATA: SortData = {
  field: null,
  order: null,
};

const SAMPLE_DATA = [
  {
    id: 1,
    firstName: "Vicki",
    last_name: "Colthurst",
    email: "vcolthurst0@merriam-webster.com",
    gender: "Female",
    ipAddress: "128.33.148.223",
  },
  {
    id: 2,
    firstName: "Giulio",
    last_name: "Mullineux",
    email: "gmullineux1@constantcontact.com",
    gender: "Male",
    ipAddress: "15.144.169.97",
  },
  {
    id: 3,
    firstName: "Pattie",
    last_name: "Meuse",
    email: "pmeuse2@examiner.com",
    gender: "Female",
    ipAddress: "241.255.45.126",
  },
  {
    id: 4,
    firstName: "Nicolle",
    last_name: "Buesden",
    email: "nbuesden3@buzzfeed.com",
    gender: "Female",
    ipAddress: "72.87.253.229",
  },
  {
    id: 5,
    firstName: "Xenos",
    last_name: "Lope",
    email: "xlope4@cnbc.com",
    gender: "Male",
    ipAddress: "59.107.20.65",
  },
  {
    id: 6,
    firstName: "Hildagarde",
    last_name: "Attrey",
    email: "hattrey5@virginia.edu",
    gender: "Female",
    ipAddress: "12.136.45.65",
  },
  {
    id: 7,
    firstName: "Gabie",
    last_name: "Whybrow",
    email: "gwhybrow6@paginegialle.it",
    gender: "Male",
    ipAddress: "195.162.229.185",
  },
  {
    id: 8,
    firstName: "Huntlee",
    last_name: "Lansly",
    email: "hlansly7@networkadvertising.org",
    gender: "Male",
    ipAddress: "212.200.96.124",
  },
  {
    id: 9,
    firstName: "Temp",
    last_name: "Gullane",
    email: "tgullane8@mlb.com",
    gender: "Male",
    ipAddress: "213.183.123.120",
  },
  {
    id: 10,
    firstName: "Karlie",
    last_name: "Hunter",
    email: "khunter9@google.com",
    gender: "Female",
    ipAddress: "104.83.5.184",
  },
];

const SAMPLE_FILTER = ["Female", "Male"];

export const Default = (props: any) => {
  return (
    <DataGrid
      fields={FIELDS}
      title="List Title"
      titleType={EnumTitleType.PageTitle}
      loading={false}
      sortDir={SORT_DATA}
      onSortChange={props.onSortChange}
    >
      {SAMPLE_DATA.map((item) => {
        return (
          <DataGridRow
            key={item.id}
            onClick={props.onRowClick}
            clickData={item}
          >
            <DataGridCell>{item.id}</DataGridCell>
            <DataGridCell>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                {item.firstName}
              </a>
            </DataGridCell>
            <DataGridCell>{item.last_name}</DataGridCell>
            <DataGridCell>{item.email}</DataGridCell>
            <DataGridCell alignMiddle>{item.gender}</DataGridCell>
            <DataGridCell alignEnd>{item.ipAddress}</DataGridCell>
          </DataGridRow>
        );
      })}
    </DataGrid>
  );
};

export const WithSearch = (props: any) => {
  return (
    <DataGrid
      showSearch
      fields={FIELDS}
      title="List Title"
      titleType={EnumTitleType.PageTitle}
      loading={false}
      sortDir={SORT_DATA}
      onSortChange={props.onSortChange}
      onSearchChange={props.onSearchChange}
    >
      {SAMPLE_DATA.map((item) => {
        return (
          <DataGridRow
            key={item.id}
            onClick={props.onRowClick}
            clickData={item}
          >
            <DataGridCell>{item.id}</DataGridCell>
            <DataGridCell>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                {item.firstName}
              </a>
            </DataGridCell>
            <DataGridCell>{item.last_name}</DataGridCell>
            <DataGridCell>{item.email}</DataGridCell>
            <DataGridCell alignMiddle>{item.gender}</DataGridCell>
            <DataGridCell alignEnd>{item.ipAddress}</DataGridCell>
          </DataGridRow>
        );
      })}
    </DataGrid>
  );
};

export const WithHeaderContent = (props: any) => {
  return (
    <DataGrid
      showSearch
      fields={FIELDS}
      title="List Title"
      titleType={EnumTitleType.PageTitle}
      loading={false}
      sortDir={SORT_DATA}
      onSortChange={props.onSortChange}
      onSearchChange={props.onSearchChange}
      toolbarContentEnd={<Button>Create New</Button>}
      toolbarContentStart={
        <SelectMenu title="Filter" buttonStyle={EnumButtonStyle.Secondary}>
          <SelectMenuModal>
            <SelectMenuList>
              {SAMPLE_FILTER.map((item) => (
                <SelectMenuItem key={item}>{item}</SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      }
    >
      {SAMPLE_DATA.map((item) => {
        return (
          <DataGridRow
            key={item.id}
            onClick={props.onRowClick}
            clickData={item}
          >
            <DataGridCell>{item.id}</DataGridCell>
            <DataGridCell>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                {item.firstName}
              </a>
            </DataGridCell>
            <DataGridCell>{item.last_name}</DataGridCell>
            <DataGridCell>{item.email}</DataGridCell>
            <DataGridCell alignMiddle>{item.gender}</DataGridCell>
            <DataGridCell alignEnd>{item.ipAddress}</DataGridCell>
          </DataGridRow>
        );
      })}
    </DataGrid>
  );
};
