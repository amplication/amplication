import React, { useCallback, useContext, useState } from "react";
import { gql, Reference, useMutation, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import { useTracking } from "../util/analytics";
import {
  SearchField,
  Snackbar,
  CircularProgress,
  LimitationNotification,
} from "@amplication/ui/design-system";
import { EnumImages } from "../Components/SvgThemeImage";
import * as models from "../models";
import ResourceListItem from "./ResourceListItem";
import "./ResourceList.scss";
import { AppContext } from "../context/appContext";
import CreateResourceButton from "../Components/CreateResourceButton";
import { EmptyState } from "../Components/EmptyState";
import { pluralize } from "../util/pluralize";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { GET_CURRENT_WORKSPACE } from "./queries/workspaceQueries";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";

type TDeleteResourceData = {
  deleteResource: models.Resource;
};

type TDeleteProjectData = {
  deleteProject: models.Project;
};

type GetWorkspaceResponse = {
  currentWorkspace: models.Workspace;
};

const CLASS_NAME = "resource-list";

function ResourceList() {
  const { trackEvent } = useTracking();
  const [error, setError] = useState<Error | null>(null);
  const {
    resources,
    projectConfigurationResource,
    addEntity,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentProject,
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

  const [deleteProject] = useMutation<TDeleteProjectData>(DELETE_PROJECT, {
    update(cache, { data }) {
      if (!data) return;
      const deletedProjectId = data.deleteProject.id;

      cache.modify({
        fields: {
          projects(existingProjectRefs, { readField }) {
            return existingProjectRefs.filter(
              (projectRef: Reference) =>
                deletedProjectId !== readField("id", projectRef)
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

  const handleProjectDelete = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ProjectDelete,
    });
    deleteProject({
      onCompleted: () => {
        addEntity();
      },
      variables: {
        projectId: currentProject.id,
      },
    }).catch(setError);
  }, [currentProject, deleteProject, setError, trackEvent]);

  const { data: getWorkspaceData } = useQuery<GetWorkspaceResponse>(
    GET_CURRENT_WORKSPACE
  );

  const { stigg } = useStiggContext();
  const hideNotifications = stigg.getBooleanEntitlement({
    featureId: BillingFeature.HideNotifications,
  });

  const errorMessage =
    formatError(errorResources) || (error && formatError(error));

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        <CreateResourceButton />
      </div>
      <hr className={`${CLASS_NAME}__separator`} />
      <div className={`${CLASS_NAME}__title`}>Project Settings</div>

      <div className={`${CLASS_NAME}__settings`}>
        {!loadingResources && projectConfigurationResource && (
          <ResourceListItem
            resource={projectConfigurationResource}
            onDelete={handleProjectDelete}
          />
        )}
      </div>
      <hr className={`${CLASS_NAME}__separator`} />
      <div className={`${CLASS_NAME}__title`}>
        {resources.length}{" "}
        {pluralize(resources.length, "Resource", "Resources")}
      </div>
      {loadingResources && <CircularProgress centerToParent />}

      {!hideNotifications.hasAccess && (
        <LimitationNotification
          description="With the current plan, you can use up to 3 services."
          link={`/${getWorkspaceData.currentWorkspace.id}/purchase`}
          handleClick={handleResourceClick}
        />
      )}

      <div className={`${CLASS_NAME}__content`}>
        {isEmpty(resources) && !loadingResources ? (
          <EmptyState
            message="There are no resources to show"
            image={EnumImages.AddResource}
          />
        ) : (
          !loadingResources &&
          resources.map((resource) => (
            <ResourceListItem
              key={resource.id}
              resource={resource}
              onDelete={handleResourceDelete}
            />
          ))
        )}
      </div>

      <Snackbar
        open={Boolean(error || errorResources)}
        message={errorMessage}
        onClose={clearError}
      />
    </div>
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

const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: String!) {
    deleteProject(where: { id: $projectId }) {
      id
    }
  }
`;
