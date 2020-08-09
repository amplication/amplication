import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import * as types from "../types";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import EntityForm from "./EntityForm";

import "./Entity.scss";

type Props = {
  match: match<{ application: string; entityId: string }>;
};

type TData = {
  entity: types.Entity;
};

function Entity({ match }: Props) {
  const { entityId, application } = match.params;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  const [updateEntity, { error: updateError }] = useMutation(UPDATE_ENTITY);

  const handleSubmit = useCallback(
    (data: Omit<types.Entity, "fields" | "versionNumber">) => {
      let { id, ...sanitizedCreateData } = data;

      updateEntity({
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
    [updateEntity]
  );

  const errorMessage = formatError(error || updateError);
  return (
    <PageContent className="entity" withFloatingBar>
      <main>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <FloatingToolbar />
            <EntityForm
              entity={data?.entity}
              applicationId={application}
              onSubmit={handleSubmit}
            ></EntityForm>
          </>
        )}
      </main>
      <Snackbar open={Boolean(error || updateError)} message={errorMessage} />
    </PageContent>
  );
}

export default Entity;

export const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }, version: 0) {
      name
      versionNumber
      displayName
      pluralDisplayName
      description
      lockedByUserId
      lockedAt
      fields {
        id
        name
        displayName
        required
        searchable
        dataType
        description
      }
    }
  }
`;

const UPDATE_ENTITY = gql`
  mutation updateEntity($data: EntityUpdateInput!, $where: WhereUniqueInput!) {
    updateEntity(data: $data, where: $where) {
      name
      versionNumber
      displayName
      pluralDisplayName
      description
      lockedByUserId
      lockedAt
      fields {
        id
        name
        displayName
        required
        searchable
        dataType
        description
      }
    }
  }
`;
