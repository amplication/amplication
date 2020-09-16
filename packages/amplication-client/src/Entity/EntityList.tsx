import React, { useState, useCallback, useEffect } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";

import { formatError } from "../util/error";
import * as models from "../models";
import { DataGrid, DataField, EnumTitleType } from "../Components/DataGrid";
import { Dialog } from "../Components/Dialog";

import NewEntity from "./NewEntity";
import { EntityListItem } from "./EntityListItem";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import "@rmwc/data-table/styles";

import { Button, EnumButtonStyle } from "../Components/Button";

const fields: DataField[] = [
  {
    name: "lockedByUserId",
    title: "",
    icon: "lock",
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

type Props = {
  match: match<{ application: string }>;
};

const NAME_FIELD = "displayName";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};
const POLL_INTERVAL = 2000;

export const EntityList = ({ match }: Props) => {
  const [error, setError] = useState<Error>();

  const { application } = match.params;
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

  const {
    data,
    loading,
    error: errorLoading,
    refetch,
    stopPolling,
    startPolling,
  } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: application,
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

  //start polling with cleanup
  useEffect(() => {
    refetch().catch(console.error);
    startPolling(POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return (
    <PageContent className="pages" withFloatingBar>
      <main>
        <FloatingToolbar />

        <Dialog
          className="new-entity-dialog"
          isOpen={newEntity}
          onDismiss={handleNewEntityClick}
          title="New Entity"
        >
          <NewEntity applicationId={application} />
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
              key={entity.id}
              entity={entity}
              applicationId={application}
              onDelete={refetch}
              onError={setError}
            />
          ))}
        </DataGrid>

        <Snackbar
          open={Boolean(error || errorLoading)}
          message={errorMessage}
        />
      </main>
    </PageContent>
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
      name
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
