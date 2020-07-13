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
  const { entityPageId, application } = match.params;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PAGE, {
    variables: {
      id: entityPageId,
    },
  });

  const [createEntityPage, { error: createError }] = useMutation(
    CREATE_ENTITY_PAGE //cache is updated automatically by apollo client based on id
  );

  const handleSubmit = useCallback(
    (data: Omit<types.EntityPage, "blockType" | "versionNumber">) => {
      console.log(data);

      //if (!data.id || !data.id.length) {
      console.log(data);

      //create
      let { id, ...sanitizedCreateData } = data;

      createEntityPage({
        variables: {
          data: {
            ...sanitizedCreateData,
            app: {
              connect: { id: application },
            },
          },
        },
      }).catch(console.error);
      // } else {
      //   //update
      // }
    },
    [createEntityPage, application]
  );

  const errorMessage = formatError(error || createError);
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
      <Snackbar open={Boolean(error || createError)} message={errorMessage} />
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

const CREATE_ENTITY_PAGE = gql`
  mutation createEntityPage($data: EntityPageCreateInput!) {
    createEntityPage(data: $data) {
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
