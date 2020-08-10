import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import * as models from "../models";
import Sidebar from "../Layout/Sidebar";
import { formatError } from "../util/error";
import EntityPageForm from "./EntityPageForm";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

import "./EntityPage.scss";

type Props = {
  match: match<{ application: string; entityPageId: string }>;
};

type TData = {
  EntityPage: models.EntityPage;
};

function EntityPage({ match }: Props) {
  const { entityPageId, application } = match.params;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PAGE, {
    variables: {
      id: entityPageId,
    },
  });

  const [updateEntityPage, { error: updateError }] = useMutation(
    UPDATE_ENTITY_PAGE
  );

  const handleSubmit = useCallback(
    (data: Omit<models.EntityPage, "blockType" | "versionNumber">) => {
      let { id, ...sanitizedCreateData } = data;

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
    <PageContent className="entity-page" withFloatingBar>
      <main>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <FloatingToolbar />
            <div className="entity-page__preview">
              <h1>{data?.EntityPage.displayName}</h1>
            </div>
          </>
        )}
      </main>
      <Sidebar>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <EntityPageForm
            entityPage={data?.EntityPage}
            onSubmit={handleSubmit}
            applicationId={application}
          ></EntityPageForm>
        )}
      </Sidebar>
      <Snackbar open={Boolean(error || updateError)} message={errorMessage} />
    </PageContent>
  );
}

export default EntityPage;

export const GET_ENTITY_PAGE = gql`
  query getEntityPage($id: String!) {
    EntityPage(where: { id: $id }, version: 0) {
      id
      displayName
      description
      entityId
      pageType
      showAllFields
      showFieldList
      singleRecordSettings {
        allowCreation
        allowDeletion
        allowUpdate
      }
      listSettings {
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
      displayName
      description
      entityId
      pageType
      showAllFields
      showFieldList
      singleRecordSettings {
        allowCreation
        allowDeletion
        allowUpdate
      }
      listSettings {
        enableSearch
        navigateToPageId
      }
    }
  }
`;
