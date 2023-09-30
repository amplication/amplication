import {
  CircleBadge,
  CircularProgress,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  LimitationNotification,
  List,
  Panel,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { Reference, gql, useMutation } from "@apollo/client";
import { useStiggContext } from "@stigg/react-sdk";
import { isEmpty } from "lodash";
import { useCallback, useContext, useState } from "react";
import CreateResourceButton from "../Components/CreateResourceButton";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { BillingFeature } from "../util/BillingFeature";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import ResourceListItem from "./ResourceListItem";

type TDeleteResourceData = {
  deleteResource: models.Resource;
};

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

function ResourceList() {
  const { trackEvent } = useTracking();

  const [error, setError] = useState<Error | null>(null);

  const {
    resources,
    addEntity,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentProject,
    currentWorkspace,
  } = useContext(AppContext);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const handleResourceClick = () => {
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeOnResourceListClick,
    });
  };

  const [deleteResource] = useMutation<TDeleteResourceData>(DELETE_RESOURCE, {
    update(cache, { data }) {
      if (!data) return;
      const deletedResourceId = data.deleteResource.id;

      cache.modify({
        fields: {
          resources(existingResourceRefs, { readField }) {
            return existingResourceRefs.filter(
              (resourceRef: Reference) =>
                deletedResourceId !== readField("id", resourceRef)
            );
          },
        },
      });
    },
  });

  const handleResourceDelete = useCallback(
    (resource) => {
      trackEvent({
        eventName: AnalyticsEventNames.ResourceDelete,
      });
      deleteResource({
        onCompleted: () => {
          addEntity();
        },
        variables: {
          resourceId: resource.id,
        },
      }).catch(setError);
    },
    [deleteResource, setError, trackEvent]
  );

  const { stigg } = useStiggContext();
  const hideNotifications = stigg.getBooleanEntitlement({
    featureId: BillingFeature.HideNotifications,
  });

  const errorMessage =
    formatError(errorResources) || (error && formatError(error));

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <FlexItem
        start={
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        }
        end={<CreateResourceButton />}
      />
      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          start={
            <CircleBadge size="xlarge" name={currentProject?.name || ""} />
          }
        >
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
          >
            <Text textStyle={EnumTextStyle.H3}>{currentProject?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentProject?.description}
            </Text>
          </FlexItem>
        </FlexItem>
      </Panel>
      <FlexItem margin={EnumFlexItemMargin.Bottom}>
        <Text textStyle={EnumTextStyle.Tag}>
          {resources.length}{" "}
          {pluralize(resources.length, "Resource", "Resources")}
        </Text>
      </FlexItem>
      {loadingResources && <CircularProgress centerToParent />}

      {!hideNotifications.hasAccess && (
        <LimitationNotification
          description="With the current plan, you can use up to 3 services."
          link={`/${currentWorkspace?.id}/purchase`}
          handleClick={handleResourceClick}
        />
      )}

      {isEmpty(resources) && !loadingResources ? (
        <EmptyState
          message="There are no resources to show"
          image={EnumImages.AddResource}
        />
      ) : (
        <List>
          {!loadingResources &&
            resources.map((resource) => (
              <ResourceListItem
                key={resource.id}
                resource={resource}
                onDelete={handleResourceDelete}
              />
            ))}
        </List>
      )}

      <Snackbar
        open={Boolean(error || errorResources)}
        message={errorMessage}
        onClose={clearError}
      />
    </PageContent>
  );
}

export default ResourceList;

const DELETE_RESOURCE = gql`
  mutation deleteResource($resourceId: String!) {
    deleteResource(where: { id: $resourceId }) {
      id
    }
  }
`;
