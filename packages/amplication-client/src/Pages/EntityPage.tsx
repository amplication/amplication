import React from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import * as types from "../types";
import Sidebar from "../Layout/Sidebar";
import { formatError } from "../util/error";
import EntityPageForm from "./EntityPageForm";

type Props = {
  match: match<{ application: string; entityPageId: string }>;
};

type TData = {
  EntityPage: types.EntityPage;
};

function EntityPage({ match }: Props) {
  const { entityPageId } = match.params;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PAGE, {
    variables: {
      id: entityPageId,
    },
  });

  const errorMessage = formatError(error);

  return (
    <>
      <main className="entity-page">
        {loading ? <span>Loading...</span> : data?.EntityPage.name}
      </main>
      <Sidebar>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <EntityPageForm entityPage={data?.EntityPage}></EntityPageForm>
        )}
      </Sidebar>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default EntityPage;

export const GET_ENTITY_PAGE = gql`
  query getEntityPage($id: String!) {
    EntityPage(where: { id: $id }, version: 0) {
      id
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
