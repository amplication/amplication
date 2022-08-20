import React, { useCallback, useContext, useState } from "react";
import { gql, Reference, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import { useTracking } from "../util/analytics";

import {
  SearchField,
  Snackbar,
  CircularProgress,
  HorizontalRule,
} from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

import * as models from "../models";
import ResourceListItem from "./ResourceListItem";
import "./ResourceList.scss";
import { AppContext } from "../context/appContext";

type TDeleteData = {
  deleteResource: models.Resource;
};

const CLASS_NAME = "resource-list";

function ResourceList() {
  const { trackEvent } = useTracking();
  const [error, setError] = useState<Error | null>(null);
  const {
    resources,
    projectConfigurationResource,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentWorkspace,
    currentProject,
  } = useContext(AppContext);

  const linkToCreateResource = `/${currentWorkspace?.id}/${currentProject?.id}/create-resource`;

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const [deleteResource] = useMutation<TDeleteData>(DELETE_RESOURCE, {
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

  const handleDelete = useCallback(
    (resource) => {
      trackEvent({
        eventName: "deleteResource",
      });
      deleteResource({
        variables: {
          resourceId: resource.id,
        },
      }).catch(setError);
    },
    [deleteResource, setError, trackEvent]
  );

  const errorMessage =
    formatError(errorResources) || (error && formatError(error));

  const handleNewResourceClick = useCallback(() => {
    trackEvent({
      eventName: "createNewResourceCardClick",
    });
  }, [trackEvent]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <Link onClick={handleNewResourceClick} to={linkToCreateResource}>
          <Button
            className={`${CLASS_NAME}__add-button`}
            buttonStyle={EnumButtonStyle.Primary}
            icon="plus"
          >
            New service
          </Button>
        </Link>
      </div>
      <HorizontalRule />
      <div className={`${CLASS_NAME}__title`}>Project Settings</div>

      {projectConfigurationResource && (
        <ResourceListItem resource={projectConfigurationResource} />
      )}
      <HorizontalRule />
      <div className={`${CLASS_NAME}__title`}>{resources.length} Resources</div>
      {loadingResources && <CircularProgress />}

      {isEmpty(resources) && !loadingResources ? (
        <div className={`${CLASS_NAME}__empty-state`}>
          <SvgThemeImage image={EnumImages.AddResource} />
          <div className={`${CLASS_NAME}__empty-state__title`}>
            There are no resources to show
          </div>
        </div>
      ) : (
        resources.map((resource) => {
          return (
            <ResourceListItem
              key={resource.id}
              resource={resource}
              onDelete={handleDelete}
            />
          );
        })
      )}

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
