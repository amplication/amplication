import {
  CircleBadge,
  CircularProgress,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  Panel,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { Reference, gql, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import CreateResourceButton from "../Components/CreateResourceButton";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import ResourceListItem from "./ResourceListItem";
import { useStiggContext } from "@stigg/react-sdk";
import { UsageInsights } from "../UsageInsights/UsageInsights";
import "./ResourceList.scss";

type TDeleteResourceData = {
  deleteResource: models.Resource;
};

const CLASS_NAME = "resource-list";
const PAGE_TITLE = "Project Overview";

function ResourceList() {
  const { trackEvent } = useTracking();
  const { refreshData } = useStiggContext();
  const [error, setError] = useState<Error | null>(null);

  const {
    resources,
    addEntity,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentProject,
  } = useContext(AppContext);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    refreshData();
  }, []);

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
      refreshData();
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
        end={
          <>
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              direction={EnumFlexDirection.Row}
            >
              <CreateResourceButton resourcesLength={resources.length} />
            </FlexItem>
          </>
        }
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

      <FlexItem
        className={`${CLASS_NAME}__content`}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
      >
        <Panel
          panelStyle={EnumPanelStyle.Bold}
          className={`${CLASS_NAME}__resources`}
          themeColor={EnumTextColor.ThemeBlue}
        >
          <FlexItem margin={EnumFlexItemMargin.Bottom}>
            <Text textStyle={EnumTextStyle.Tag}>
              {resources.length}{" "}
              {pluralize(resources.length, "Resource", "Resources")}
            </Text>
          </FlexItem>
          {loadingResources && <CircularProgress centerToParent />}

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
        </Panel>
        <UsageInsights projectIds={[currentProject?.id]} />
      </FlexItem>

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
