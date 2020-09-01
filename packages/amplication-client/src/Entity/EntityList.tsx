import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";

import { formatError } from "../util/error";
import * as models from "../models";
import { DataGrid, DataField, EnumTitleType } from "../Components/DataGrid";
import { Dialog } from "../Components/Dialog";

import NewEntity from "./NewEntity";
import { EntityListItem } from "./EntityListItem";

import "@rmwc/data-table/styles";

import { Button, EnumButtonStyle } from "../Components/Button";

const fields: DataField[] = [
  {
    name: "lockedByUserId",
    title: "L",
    minWidth: true,
  },
  {
    name: "displayName",
    title: "Name",
    sortable: true,
  },
  {
    name: "description",
    title: "Description",
    sortable: true,
  },
  {
    name: "versionNumber",
    title: "Version",
  },
  {
    name: "lastCommitAt",
    title: "Last Commit",
  },
  {
    name: "commands",
    title: "",
  },
];

type TData = {
  entities: models.Entity[];
};

type sortData = {
  field: string | null;
  order: number | null;
};

const NAME_FIELD = "displayName";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

type Props = {
  applicationId: string;
};

export const EntityList = ({ applicationId }: Props) => {
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [newEntity, setNewEntity] = useState<boolean>(false);

  const handleSortChange = (fieldName: string, order: number | null) => {
    setSortDir({ field: fieldName, order: order === null ? 1 : order });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const handleNewEntityClick = useCallback(() => {
    setNewEntity(!newEntity);
  }, [newEntity, setNewEntity]);

  const { data, loading, error, refetch } = useQuery<TData>(GET_ENTITIES, {
    pollInterval: 2000,
    variables: {
      id: applicationId,
      orderBy: {
        [sortDir.field || NAME_FIELD]:
          sortDir.order === 1 ? models.SortOrder.Desc : models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  const errorMessage = formatError(error);

  return (
    <>
      <Dialog
        className="new-entity-dialog"
        isOpen={newEntity}
        onDismiss={handleNewEntityClick}
        title="New Entity"
      >
        <NewEntity applicationId={applicationId} />
      </Dialog>
      <DataGrid
        fields={fields}
        title="Entities"
        titleType={EnumTitleType.PageTitle}
        loading={loading}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        toolbarContentEnd={
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleNewEntityClick}
          >
            Create New
          </Button>
        }
      >
        {data?.entities.map((entity) => (
          <EntityListItem
            entity={entity}
            applicationId={applicationId}
            onDelete={refetch}
          />
        ))}
      </DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
};

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_ENTITIES = gql`
  query getEntities(
    $id: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      displayName
      description
      lockedByUserId
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
        }
      }
      entityVersions(take: 1, orderBy: { versionNumber: Desc }) {
        versionNumber
        commit {
          userId
          message
          createdAt
          user {
            id
            account {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;
