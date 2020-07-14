import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { HeaderToolbar } from "../util/teleporter";

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

  const [updateEntityPage, { error: updateError }] = useMutation(
    UPDATE_ENTITY_PAGE //cache is updated automatically by apollo client based on id
  );

  const handleSubmit = useCallback(
    (data: Omit<types.EntityPage, "blockType" | "versionNumber">) => {
      let { id, ...sanitizedCreateData } = data;

      //update
      updateEntityPage({
        variables: {
          data: {
            ...sanitizedCreateData,
          },
          where: {
            id: id,
          },
        },
      }).catch(console.error);
    },
    [updateEntityPage]
  );

  const errorMessage = formatError(error || updateError);
  return (
    <>
      <HeaderToolbar.Source>Hello</HeaderToolbar.Source>
      <main className="entity-page">
        {loading ? <span>Loading...</span> : data?.EntityPage.name}
      </main>
      <Sidebar>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <EntityPageForm
            entityPage={data?.EntityPage}
            onSubmit={handleSubmit}
          ></EntityPageForm>
        )}
      </Sidebar>
      <Snackbar open={Boolean(error || updateError)} message={errorMessage} />
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
      pageType
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
        allowCreation
        allowDeletion
        enableSearch
        navigateToPageId
      }
    }
  }
`;

const UPDATE_ENTITY_PAGE = gql`
  mutation createEntityPage(
    $data: EntityPageUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateEntityPage(data: $data, where: $where) {
      id
      name
      description
      entityId
      pageType
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
