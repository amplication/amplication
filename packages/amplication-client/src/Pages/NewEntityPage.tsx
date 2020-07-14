import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { HeaderToolbar } from "../util/teleporter";

import * as types from "../types";
import Sidebar from "../Layout/Sidebar";
import { formatError } from "../util/error";
import EntityPageForm from "./EntityPageForm";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  EntityPage: types.EntityPage;
};

function NewEntityPage({ match }: Props) {
  const { application } = match.params;

  const [createEntityPage, { error: createError }] = useMutation(
    CREATE_ENTITY_PAGE //cache is updated automatically by apollo client based on id
  );

  const handleSubmit = useCallback(
    (data: Omit<types.EntityPage, "blockType" | "versionNumber">) => {
      let { id, ...sanitizedCreateData } = data;

      //create
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
    },
    [createEntityPage, application]
  );

  const errorMessage = formatError(createError);
  return (
    <>
      <HeaderToolbar.Source>Hello</HeaderToolbar.Source>
      <main className="entity-page">New Entity Page</main>
      <Sidebar>
        <EntityPageForm
          entityPage={undefined}
          onSubmit={handleSubmit}
        ></EntityPageForm>
      </Sidebar>
      <Snackbar open={Boolean(createError)} message={errorMessage} />
    </>
  );
}

export default NewEntityPage;

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
