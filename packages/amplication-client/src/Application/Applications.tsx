import React, { useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Link } from "react-router-dom";
import "./Applications.scss";
import { formatError } from "../util/error";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import { isMobileOnly } from "react-device-detect";

import * as models from "../models";
import MainLayout from "../Layout/MainLayout";
import ApplicationCard from "./ApplicationCard";
import { Dialog } from "@amplication/design-system";
import NewApplication from "./NewApplication";
import MobileMessage from "../Layout/MobileMessage";

type TData = {
  apps: Array<models.App>;
};

function Applications() {
  const [newApp, setNewApp] = useState<boolean>(false);

  const { data, error } = useQuery<TData>(GET_APPLICATIONS);
  const errorMessage = formatError(error);

  const handleNewAppClick = useCallback(() => {
    setNewApp(!newApp);
  }, [newApp, setNewApp]);

  if (isMobileOnly) {
    return <MobileMessage />;
  }

  return (
    <>
      <Dialog
        className="new-app-dialog"
        isOpen={newApp}
        onDismiss={handleNewAppClick}
        title="New App"
      >
        <NewApplication />
      </Dialog>
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
                  to=""
                  className="applications__new-app"
                >
                  <Icon icon="plus" />
                  Create New App
                </Link>
                <Link to="/import-from-excel" className="applications__new-app">
                  <Icon icon="plus" />
                  Start from Excel file
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
    </>
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
        version
        createdAt
      }
    }
  }
`;
