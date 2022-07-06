import React, { useState, useCallback, useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { formatError } from "../util/error";
import * as models from "../models";
import {
  Dialog,
  SearchField,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";
import useNavigationTabs from "../Layout/UseNavigationTabs";

import NewEntity from "./NewEntity";
import { EntityListItem } from "./EntityListItem";
import PageContent from "../Layout/PageContent";

import { Button, EnumButtonStyle } from "../Components/Button";
import "./EntityList.scss";

type TData = {
  entities: models.Entity[];
};

type Props = {
  match: match<{ application: string }>;
};

const NAME_FIELD = "displayName";
const CLASS_NAME = "entity-list";
const NAVIGATION_KEY = "ENTITY_LIST";

const POLL_INTERVAL = 2000;

export const EntityList = ({ match }: Props) => {
  const { application } = match.params;
  const [error, setError] = useState<Error>();
  const pageTitle = "Entities";
  useNavigationTabs(application, NAVIGATION_KEY, match.url, pageTitle);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [newEntity, setNewEntity] = useState<boolean>(false);

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
        [NAME_FIELD]: models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

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
    <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
      <Dialog
        className="new-entity-dialog"
        isOpen={newEntity}
        onDismiss={handleNewEntityClick}
        title="New Entity"
      >
        <NewEntity applicationId={application} />
      </Dialog>
      <div className={`${CLASS_NAME}__header`}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <Button
          className={`${CLASS_NAME}__add-button`}
          buttonStyle={EnumButtonStyle.Primary}
          onClick={handleNewEntityClick}
          icon="plus"
        >
          Add entity
        </Button>
      </div>
      <div className={`${CLASS_NAME}__title`}>
        {data?.entities.length} Entities
      </div>
      {loading && <CircularProgress />}

      {data?.entities.map((entity) => (
        <EntityListItem
          key={entity.id}
          entity={entity}
          applicationId={application}
          onError={setError}
        />
      ))}

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
