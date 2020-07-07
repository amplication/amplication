import React from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import * as types from "../types";
import Sidebar from "../Layout/Sidebar";
import { formatError } from "../util/error";

type Props = {
  match: match<{ application: string; entityPage: string }>;
};

type TData = {
  EntityPage: types.EntityPage;
};

function Pages({ match }: Props) {
  const { entityPage } = match.params;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PAGE, {
    variables: {
      id: entityPage,
    },
  });

  const errorMessage = formatError(error);

  return (
    <>
      <main className="entity-page">
        {loading ? <span>Loading...</span> : data?.EntityPage.name}
      </main>
      <Sidebar>
        {loading ? <span>Loading...</span> : data?.EntityPage.name}
      </Sidebar>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default Pages;

export const GET_ENTITY_PAGE = gql`
  query getEntityPage($id: String!) {
    EntityPage(where: { id: $id }, version: 0) {
      name
      description
      entityId
      singleRecordSettings {
        showAllFields
        showFieldList
        allowCreation
        allowDeletion
        allowUpdate
      }
      listSettings {
        showAllFields
        showFieldList
        enableSearch
        navigateToPageId
      }
    }
  }
`;
