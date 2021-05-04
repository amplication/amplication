import React, { useCallback, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { isEmpty } from "lodash";
import "@rmwc/snackbar/styles";
import { Link, useHistory } from "react-router-dom";
import "./Applications.scss";
import { formatError } from "../util/error";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import { isMobileOnly } from "react-device-detect";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import MainLayout from "../Layout/MainLayout";
import ApplicationCard from "./ApplicationCard";
import MobileMessage from "../Layout/MobileMessage";

type TData = {
  apps: Array<models.App>;
};

function Applications() {
  const { trackEvent } = useTracking();
  const history = useHistory();

  const { data, error } = useQuery<TData>(GET_APPLICATIONS);
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
    <MainLayout>
      <MainLayout.Menu />
      <MainLayout.Content>
        <div className="applications">
          <div className="applications__bg">
            <div className="applications__header">
              <h1>My Apps</h1>
            </div>
            <div
              className={classNames("previews", {
                "previews--center": (data?.apps.length || 0) < 3,
              })}
            >
              <Link
                onClick={handleNewAppClick}
                to="/create-app"
                className="applications__new-app"
              >
                <Icon icon="plus" />
                Create New App
              </Link>
              {data?.apps.map((app) => {
                return <ApplicationCard key={app.id} app={app} />;
              })}
            </div>
          </div>
          <Snackbar open={Boolean(error)} message={errorMessage} />
        </div>
      </MainLayout.Content>
    </MainLayout>
  );
}

export default Applications;

export const GET_APPLICATIONS = gql`
  query getApplications {
    apps(orderBy: { createdAt: Desc }) {
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
