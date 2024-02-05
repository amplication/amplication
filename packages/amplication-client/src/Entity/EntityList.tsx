import {
  CircularProgress,
  Dialog,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  LimitationNotification,
  List,
  SearchField,
  Snackbar,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, match } from "react-router-dom";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { EntityListItem } from "./EntityListItem";
import NewEntity from "./NewEntity";

import { Button, EnumButtonStyle } from "../Components/Button";
import usePlugins from "../Plugins/hooks/usePlugins";
import { GET_CURRENT_WORKSPACE } from "../Workspaces/queries/workspaceQueries";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import { BillingFeature } from "@amplication/util-billing-types";
import { pluralize } from "../util/pluralize";
import EntitiesERD from "./EntityERD/EntitiesERD";
import "./EntityList.scss";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";
import {
  LicenseIndicatorContainer,
  LicensedResourceType,
} from "../Components/LicenseIndicatorContainer";

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

const POLL_INTERVAL = 30000;

const EntityList: React.FC<Props> = ({ match, innerRoutes }) => {
  const { resource } = match.params;
  const { trackEvent } = useTracking();
  const [error, setError] = useState<Error>();
  const pageTitle = "Entities";
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [newEntity, setNewEntity] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<"table" | "graph">("table");
  const { pluginInstallations } = usePlugins(resource);

  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const isUserEntityMandatory =
    pluginInstallations?.filter(
      (x) =>
        x?.configurations?.requireAuthenticationEntity === "true" && x.enabled
    )?.length > 0;

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
      eventName: AnalyticsEventNames.UpgradeClick,
      eventOriginLocation: "entity-list",
    });
  };

  const { data: getWorkspaceData } = useQuery<GetWorkspaceResponse>(
    GET_CURRENT_WORKSPACE
  );

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return match.isExact ? (
    <PageContent
      className={CLASS_NAME}
      pageTitle={pageTitle}
      pageWidth={
        displayMode === "table" ? EnumPageWidth.Default : EnumPageWidth.Full
      }
    >
      <>
        <Dialog
          isOpen={newEntity}
          onDismiss={handleNewEntityClick}
          title="New Entity"
        >
          <NewEntity resourceId={resource} onSuccess={handleNewEntityClick} />
        </Dialog>

        <FlexItem
          contentAlign={EnumContentAlign.Center}
          itemsAlign={EnumItemsAlign.Center}
        >
          <FlexItem.FlexStart>
            <SearchField
              label="search"
              placeholder="search"
              onChange={handleSearchChange}
            />
          </FlexItem.FlexStart>

          <FlexItem
            direction={EnumFlexDirection.Row}
            contentAlign={EnumContentAlign.Center}
            itemsAlign={EnumItemsAlign.Center}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.9068 3.9068C4.16726 3.64633 4.52053 3.5 4.88889 3.5L11.1111 3.5C11.4795 3.5 11.8327 3.64633 12.0932 3.9068C12.3537 4.16726 12.5 4.52053 12.5 4.88889L12.5 11.1111C12.5 11.4795 12.3537 11.8327 12.0932 12.0932C11.8327 12.3537 11.4795 12.5 11.1111 12.5H4.88889C4.52053 12.5 4.16726 12.3537 3.9068 12.0932C3.64633 11.8327 3.5 11.4795 3.5 11.1111L3.5 4.88889C3.5 4.52053 3.64633 4.16726 3.9068 3.9068ZM4.88889 4.5C4.78575 4.5 4.68683 4.54097 4.6139 4.6139C4.54097 4.68683 4.5 4.78575 4.5 4.88889L4.5 7.5H11.5L11.5 4.88889C11.5 4.78575 11.459 4.68683 11.3861 4.6139C11.3132 4.54097 11.2143 4.5 11.1111 4.5L4.88889 4.5ZM11.5 8.5H4.5L4.5 11.1111C4.5 11.2143 4.54097 11.3132 4.6139 11.3861C4.68683 11.459 4.78575 11.5 4.88889 11.5H11.1111C11.2143 11.5 11.3132 11.459 11.3861 11.3861C11.459 11.3132 11.5 11.2143 11.5 11.1111V8.5Z"
                fill={displayMode === "table" ? "white" : "#686F8C"}
              />
            </svg>

            <Toggle
              value={displayMode === "graph"}
              defaultChecked={displayMode === "graph"}
              onValueChange={(isGraph) =>
                setDisplayMode(isGraph ? "graph" : "table")
              }
            />
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.74923 1.58091C2.10402 1.58091 1.58097 2.10396 1.58097 2.74917C1.58097 3.39437 2.10402 3.91742 2.74923 3.91742C3.39444 3.91742 3.91748 3.39437 3.91748 2.74917C3.91748 2.10396 3.39444 1.58091 2.74923 1.58091ZM0.666687 2.74917C0.666687 1.59901 1.59907 0.666626 2.74923 0.666626C3.89938 0.666626 4.83177 1.59901 4.83177 2.74917C4.83177 3.74227 4.13662 4.57302 3.20637 4.78137L3.20637 10.8761C3.20637 11.1286 3.0017 11.3333 2.74923 11.3333C2.49675 11.3333 2.29208 11.1286 2.29208 10.8761L2.29208 4.78137C1.36183 4.57302 0.666687 3.74227 0.666687 2.74917ZM6.08468 2.74917C6.08468 2.49669 6.28935 2.29202 6.54182 2.29202H8.16722C8.57585 2.29202 8.96774 2.45435 9.25668 2.74329C9.54563 3.03224 9.70796 3.42413 9.70796 3.83276V7.21854C10.6382 7.4269 11.3334 8.25765 11.3334 9.25075C11.3334 10.4009 10.401 11.3333 9.25081 11.3333C8.10066 11.3333 7.16827 10.4009 7.16827 9.25075C7.16827 8.25765 7.86342 7.4269 8.79367 7.21854V3.83276C8.79367 3.66662 8.72767 3.50728 8.61019 3.38979C8.4927 3.27231 8.33336 3.20631 8.16722 3.20631H6.54182C6.28935 3.20631 6.08468 3.00164 6.08468 2.74917ZM9.25081 8.0825C8.60561 8.0825 8.08256 8.60554 8.08256 9.25075C8.08256 9.89596 8.60561 10.419 9.25081 10.419C9.89602 10.419 10.4191 9.89596 10.4191 9.25075C10.4191 8.60554 9.89602 8.0825 9.25081 8.0825Z"
                fill={displayMode === "graph" ? "white" : "#686F8C"}
              />
            </svg>
          </FlexItem>
          <FlexItem.FlexEnd>
            <FlexItem direction={EnumFlexDirection.Row}>
              <Link
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities/import-schema`}
              >
                <FeatureIndicatorContainer
                  featureId={BillingFeature.ImportDBSchema}
                  entitlementType={EntitlementType.Boolean}
                  limitationText="Available in Enterprise plans only. "
                  reversePosition={true}
                >
                  <Button
                    className={`${CLASS_NAME}__install`}
                    buttonStyle={EnumButtonStyle.Outline}
                    eventData={{
                      eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                    }}
                  >
                    Upload Prisma Schema
                  </Button>
                </FeatureIndicatorContainer>
              </Link>
              <LicenseIndicatorContainer
                licensedResourceType={LicensedResourceType.Service}
              >
                <Button
                  className={`${CLASS_NAME}__add-button`}
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={handleNewEntityClick}
                >
                  Add entity
                </Button>
              </LicenseIndicatorContainer>
            </FlexItem>
          </FlexItem.FlexEnd>
        </FlexItem>

        <HorizontalRule doubleSpacing />

        {loading && <CircularProgress centerToParent />}
        <>
          {displayMode === "table" ? (
            <>
              <FlexItem margin={EnumFlexItemMargin.Bottom}>
                <Text textStyle={EnumTextStyle.Tag}>
                  {data?.entities.length}{" "}
                  {pluralize(data?.entities.length, "Entity", "Entities")}
                </Text>
              </FlexItem>

              <List>
                {data?.entities.map((entity) => (
                  <EntityListItem
                    key={entity.id}
                    entity={entity}
                    resourceId={resource}
                    onError={setError}
                    isUserEntityMandatory={isUserEntityMandatory}
                    relatedEntities={data.entities.filter(
                      (dataEntity) =>
                        dataEntity.fields.some(
                          (field) =>
                            field.properties.relatedEntityId === entity.id
                        ) && dataEntity.id !== entity.id
                    )}
                  />
                ))}
              </List>
            </>
          ) : (
            <EntitiesERD resourceId={resource} />
          )}
        </>

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
