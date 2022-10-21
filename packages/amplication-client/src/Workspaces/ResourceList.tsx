import React, { useCallback, useContext, useState } from "react";
import { gql, Reference, useMutation } from "@apollo/client";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import { useTracking } from "../util/analytics";

import {
  SearchField,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";
import { EnumImages } from "../Components/SvgThemeImage";

import * as models from "../models";
import ResourceListItem from "./ResourceListItem";
import "./ResourceList.scss";
import { AppContext } from "../context/appContext";
import CreateResourceButton from "../Components/CreateResourceButton";
import { EmptyState } from "../Components/EmptyState";
import { pluralize } from "../util/pluralize";

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
  } = useContext(AppContext);

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
          <ResourceListItem resource={projectConfigurationResource} />
        )}
      </div>
      <hr className={`${CLASS_NAME}__separator`} />
      <div className={`${CLASS_NAME}__title`}>{resources.length} {pluralize(resources.length, 'Resource', 'Resources')}</div>
      {loadingResources && <CircularProgress centerToParent />}

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
              onDelete={handleDelete}
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
