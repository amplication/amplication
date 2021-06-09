import React, { useCallback, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { isEmpty } from "lodash";
import "@rmwc/snackbar/styles";
import { Link, useHistory } from "react-router-dom";
import "./ApplicationList.scss";
import { CircularProgress } from "@rmwc/circular-progress";
import { formatError } from "../util/error";
import { isMobileOnly } from "react-device-detect";
import { useTracking } from "../util/analytics";

import { SearchField } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";

import * as models from "../models";
import ApplicationListItem from "./ApplicationListItem";
import MobileMessage from "../Layout/MobileMessage";

type TData = {
  apps: Array<models.App>;
};

const CLASS_NAME = "application-list";

function ApplicationList() {
  const { trackEvent } = useTracking();
  const history = useHistory();
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const { data, error, loading } = useQuery<TData>(GET_APPLICATIONS, {
    variables: {
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });
  const errorMessage = formatError(error);

  const handleNewAppClick = useCallback(() => {
    trackEvent({
      eventName: "createNewAppCardClick",
    });
  }, [trackEvent]);

  useEffect(() => {
    if (data && isEmpty(data.apps)) {
      history.replace({ pathname: "/create-app" });
    }
  }, [data, history]);

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

      {data?.apps.map((app) => {
        return <ApplicationListItem key={app.id} app={app} />;
      })}

      <Snackbar open={Boolean(error)} message={errorMessage} />
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
