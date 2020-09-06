import React from "react";
import YAML from "yaml";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import * as models from "../models";

const CLASS_NAME = "pending-change-diff";

type TData = {
  entity: models.Entity;
};

type Props = {
  change: models.PendingChange;
};

const PendingChangeDiff = ({ change }: Props) => {
  const { data: dataLastVersion } = useQuery<TData>(GET_ENTITY_VERSION, {
    variables: {
      id: change.resourceId,
      whereVersion: undefined,
    },
    fetchPolicy: "no-cache",
  });

  const { data: dataCurrentVersion } = useQuery<TData>(GET_ENTITY_VERSION, {
    variables: {
      id: change.resourceId,
      whereVersion: {
        equals: 0,
      },
    },
    fetchPolicy: "no-cache",
  });

  return (
    <div className={CLASS_NAME}>
      <ReactDiffViewer
        compareMethod={DiffMethod.WORDS}
        oldValue={YAML.stringify(dataLastVersion?.entity)}
        newValue={YAML.stringify(dataCurrentVersion?.entity)}
        splitView
      />
    </div>
  );
};

export default PendingChangeDiff;

export const GET_ENTITY_VERSION = gql`
  query getEntityVersionForCompare($id: String!, $whereVersion: IntFilter) {
    entity(where: { id: $id }) {
      id
      entityVersions(
        take: 1
        orderBy: { versionNumber: Desc }
        where: { versionNumber: $whereVersion }
      ) {
        versionNumber

        fields(orderBy: { fieldPermanentId: Asc }) {
          fieldPermanentId
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
