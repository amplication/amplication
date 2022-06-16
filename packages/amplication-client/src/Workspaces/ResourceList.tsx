import React, { useCallback, useState } from "react";
import { gql, Reference, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import { useTracking } from "../util/analytics";

import {
  SearchField,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

import * as models from "../models";
import ApplicationListItem from "./ApplicationListItem";
import "./ResourceList.scss";

type TData = {
  resources: Array<models.Resource>;
};

type TDeleteData = {
  deleteResource: models.Resource;
};

const CLASS_NAME = "application-list";

function ResourceList() {
  const { trackEvent } = useTracking();
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

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

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const { data, error: errorLoading, loading } = useQuery<TData>(
    GET_RESOURCES,
    {
      variables: {
        whereName:
          searchPhrase !== ""
            ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
            : undefined,
      },
    }
  );
  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

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

        <Link onClick={handleNewResourceClick} to="/create-resource">
          <Button
            className={`${CLASS_NAME}__add-button`}
            buttonStyle={EnumButtonStyle.Primary}
            icon="plus"
          >
            New resource
          </Button>
        </Link>
      </div>
      <div className={`${CLASS_NAME}__title`}>
        {data?.resources.length} Resources
      </div>
      {loading && <CircularProgress />}

      {isEmpty(data?.resources) && !loading ? (
        <div className={`${CLASS_NAME}__empty-state`}>
          <SvgThemeImage image={EnumImages.AddApp} />
          <div className={`${CLASS_NAME}__empty-state__title`}>
            There are no resources to show
          </div>
        </div>
      ) : (
        data?.resources.map((app) => {
          return (
            <ApplicationListItem
              key={app.id}
              resource={app}
              onDelete={handleDelete}
            />
          );
        })
      )}

      <Snackbar
        open={Boolean(error || errorLoading)}
        message={errorMessage}
        onClose={clearError}
      />
    </div>
  );
}

export default ResourceList;

export const GET_RESOURCES = gql`
  query getResources($whereName: StringFilter) {
    resources(where: { name: $whereName }, orderBy: { createdAt: Desc }) {
      id
      name
      description
      color
      updatedAt
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        version
        createdAt
        status
        action {
          id
          createdAt
          steps {
            id
            name
            createdAt
            message
            status
            completedAt
            logs {
              id
              createdAt
              message
              meta
              level
            }
          }
        }
      }
    }
  }
`;

const DELETE_RESOURCE = gql`
  mutation deleteResource($resourceId: String!) {
    deleteResource(where: { id: $resourceId }) {
      id
    }
  }
`;
