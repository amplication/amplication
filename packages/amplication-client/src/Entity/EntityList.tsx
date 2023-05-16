import React, { useState, useCallback, useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  Dialog,
  SearchField,
  Snackbar,
  CircularProgress,
  LimitationNotification,
} from "@amplication/ui/design-system";
import NewEntity from "./NewEntity";
import { EntityListItem } from "./EntityListItem";
import PageContent from "../Layout/PageContent";

import { Button, EnumButtonStyle } from "../Components/Button";
import "./EntityList.scss";
import { AppRouteProps } from "../routes/routesUtil";
import { pluralize } from "../util/pluralize";
import { GET_CURRENT_WORKSPACE } from "../Workspaces/queries/workspaceQueries";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";

type TData = {
  entities: models.Entity[];
};

type GetWorkspaceResponse = {
  currentWorkspace: models.Workspace;
};

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const NAME_FIELD = "displayName";
const CLASS_NAME = "entity-list";

const POLL_INTERVAL = 2000;

const EntityList: React.FC<Props> = ({ match, innerRoutes }) => {
  const { resource } = match.params;
  const { trackEvent } = useTracking();
  const [error, setError] = useState<Error>();
  const pageTitle = "Entities";
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
      id: resource,
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

  const handleEntityClick = () => {
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeOnEntityListClick,
    });
  };

  const { data: getWorkspaceData } = useQuery<GetWorkspaceResponse>(
    GET_CURRENT_WORKSPACE
  );
  const subscription =
    getWorkspaceData.currentWorkspace.subscription?.subscriptionPlan;

  const isFreePlan = subscription === models.EnumSubscriptionPlan.Free;

  const { stigg } = useStiggContext();
  const hideNotifications = stigg.getBooleanEntitlement({
    featureId: BillingFeature.HideNotifications,
  });

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return match.isExact ? (
    <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
      <>
        <Dialog
          className="new-entity-dialog"
          isOpen={newEntity}
          onDismiss={handleNewEntityClick}
          title="New Entity"
        >
          <NewEntity resourceId={resource} onSuccess={handleNewEntityClick} />
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

        <div className={`${CLASS_NAME}__separator`} />

        <div className={`${CLASS_NAME}__title`}>
          {data?.entities.length}{" "}
          {pluralize(data?.entities.length, "Entity", "Entities")}
        </div>
        {loading && <CircularProgress centerToParent />}

        {isFreePlan && !hideNotifications.hasAccess && (
          <LimitationNotification
            description="With the current plan, you can use to 7 entities per service."
            link={`/${getWorkspaceData.currentWorkspace.id}/purchase`}
            handleClick={handleEntityClick}
          />
        )}

        <div className={`${CLASS_NAME}__content`}>
          {data?.entities.map((entity) => (
            <EntityListItem
              key={entity.id}
              entity={entity}
              resourceId={resource}
              onError={setError}
              relatedEntities={data.entities.filter(
                (dataEntity) =>
                  dataEntity.fields.some(
                    (field) => field.properties.relatedEntityId === entity.id
                  ) && dataEntity.id !== entity.id
              )}
            />
          ))}
        </div>

        <Snackbar
          open={Boolean(error || errorLoading)}
          message={errorMessage}
        />
      </>
    </PageContent>
  ) : (
    innerRoutes
  );
  /**@todo: move error message to hosting page  */
};

export default EntityList;

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_ENTITIES = gql`
  query getEntities(
    $id: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { resource: { id: $id }, displayName: $whereName }
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
      fields(where: { dataType: { equals: Lookup } }) {
        permanentId
        displayName
        properties
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
