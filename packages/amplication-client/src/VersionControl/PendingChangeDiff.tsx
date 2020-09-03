import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import ReactDiffViewer from "react-diff-viewer";
import * as models from "../models";

const CLASS_NAME = "pending-change-diff";

type TData = {
  entity: models.Entity;
};

type Props = {
  change: models.PendingChange;
};

const PendingChangeDiff = ({ change }: Props) => {
  const { data } = useQuery<TData>(GET_ENTITY_LATEST_VERSION, {
    variables: {
      id: change.resourceId,
    },
  });

  return (
    <div className={CLASS_NAME}>
      <ReactDiffViewer
        oldValue={JSON.stringify(change.resource)}
        newValue={JSON.stringify(data?.entity)}
        splitView
      />
    </div>
  );
};

export default PendingChangeDiff;

export const GET_ENTITY_LATEST_VERSION = gql`
  query getEntityLatestVersion($id: String!) {
    entity(where: { id: $id }) {
      id
      entityVersions(take: 1, orderBy: { versionNumber: Desc }) {
        versionNumber
        createdAt
        fields(orderBy: { id: Desc }) {
          id
          createdAt
          updatedAt
          name
          description
          displayName
          dataType
          properties
          required
          searchable
        }
      }
    }
  }
`;
