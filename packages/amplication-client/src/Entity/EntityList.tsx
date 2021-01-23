import React, { useState, useCallback, useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";

import { formatError } from "../util/error";
import * as models from "../models";
import {
  DataGrid,
  DataField,
  EnumTitleType,
  SortData,
  Dialog,
} from "@amplication/design-system";
import useNavigationTabs from "../Layout/UseNavigationTabs";

import NewEntity from "./NewEntity";
import { EntityListItem } from "./EntityListItem";
import PageContent from "../Layout/PageContent";

import { Button, EnumButtonStyle } from "../Components/Button";

const fields: DataField[] = [
  {
    name: "lockedByUserId",
    title: "",
    icon: "pending_changes",
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
  useNavigationTabs(match.url, "Entities");
  const [error, setError] = useState<Error>();

  const { application } = match.params;
  const [sortDir, setSortDir] = useState<SortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [newEntity, setNewEntity] = useState<boolean>(false);

  const handleSortChange = (sortData: SortData) => {
    setSortDir(sortData);
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
    <PageContent className="pages">
      <Dialog
        className="new-entity-dialog"
        isOpen={newEntity}
        onDismiss={handleNewEntityClick}
        title="New Entity"
      >
        <NewEntity applicationId={application} />
      </Dialog>
      <DataGrid
        showSearch
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
            onError={setError}
          />
        ))}
      </DataGrid>

      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
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
      versions(take: 1, orderBy: { versionNumber: Desc }) {
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
