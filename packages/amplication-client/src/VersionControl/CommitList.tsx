import React, { useState, useCallback, useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";

import { formatError } from "../util/error";
import * as models from "../models";
import { DataGrid, DataField, EnumTitleType } from "../Components/DataGrid";
import { Dialog } from "../Components/Dialog";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import "@rmwc/data-table/styles";

const fields: DataField[] = [
  {
    name: "commitId",
    title: "ID",
    sortable: true,
  },
  {
    name: "createdBy",
    title: "Created",
    sortable: true,
  },
  {
    name: "commitMessage",
    title: "Message",
  },
  {
    name: "version",
    title: "Release Version",
    sortable: true,
  },
  {
    name: "buildId",
    title: "Build ID",
    sortable: true,
  },
];
export const CommitList = () => {};
