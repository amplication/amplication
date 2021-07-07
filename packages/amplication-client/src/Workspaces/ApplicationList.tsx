import React, { useCallback, useState } from "react";
import { gql, Reference, useMutation, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { CircularProgress } from "@rmwc/circular-progress";
import { formatError } from "../util/error";
import { isMobileOnly } from "react-device-detect";
import { useTracking } from "../util/analytics";

import { SearchField } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

import * as models from "../models";
import ApplicationListItem from "./ApplicationListItem";
import MobileMessage from "../Layout/MobileMessage";
import "./ApplicationList.scss";

type TData = {
  apps: Array<models.App>;
};

type TDeleteData = {
  deleteApp: models.App;
};

const CLASS_NAME = "application-list";

function ApplicationList() {
  const { trackEvent } = useTracking();
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const [deleteApp] = useMutation<TDeleteData>(DELETE_APP, {
    update(cache, { data }) {
      if (!data) return;
      const deletedAppId = data.deleteApp.id;

      cache.modify({
        fields: {
          apps(existingAppRefs, { readField }) {
            return existingAppRefs.filter(
              (appRef: Reference) => deletedAppId !== readField("id", appRef)
            );
          },
        },
      });
    },
  });

  const handleDelete = useCallback(
    (app) => {
      trackEvent({
        eventName: "deleteApp",
      });
      deleteApp({
        variables: {
          appId: app.id,
        },
      }).catch(setError);
    },
    [deleteApp, setError, trackEvent]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const { data, error: errorLoading, loading } = useQuery<TData>(
    GET_APPLICATIONS,
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

  const handleNewAppClick = useCallback(() => {
    trackEvent({
      eventName: "createNewAppCardClick",
    });
  }, [trackEvent]);

  if (isMobileOnly) {
    return <MobileMessage />;
  }

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        <Link onClick={handleNewAppClick} to="/create-app">
          <Button
            className={`${CLASS_NAME}__add-button`}
            buttonStyle={EnumButtonStyle.Primary}
            icon="plus"
          >
            New app
          </Button>
        </Link>
      </div>
      <div className={`${CLASS_NAME}__title`}>{data?.apps.length} Apps</div>
      {loading && <CircularProgress />}

      {isEmpty(data?.apps) && !loading ? (
        <div className={`${CLASS_NAME}__empty-state`}>
          <SvgThemeImage image={EnumImages.AddApp} />
          <div className={`${CLASS_NAME}__empty-state__title`}>
            There are no apps to show
          </div>
        </div>
      ) : (
        data?.apps.map((app) => {
          return (
            <ApplicationListItem
              key={app.id}
              app={app}
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

export default ApplicationList;

export const GET_APPLICATIONS = gql`
  query getApplications($whereName: StringFilter) {
    apps(where: { name: $whereName }, orderBy: { createdAt: Desc }) {
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

const DELETE_APP = gql`
  mutation deleteApp($appId: String!) {
    deleteApp(where: { id: $appId }) {
      id
    }
  }
`;
