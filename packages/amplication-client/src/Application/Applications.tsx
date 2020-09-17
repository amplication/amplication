import React, { useCallback, useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import { Link } from "react-router-dom";
import "./Applications.scss";
import { formatError } from "../util/error";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";

import * as models from "../models";
import MainLayout from "../Layout/MainLayout";
import PageContent from "../Layout/PageContent";
import ApplicationCard from "./ApplicationCard";
import { Dialog } from "../Components/Dialog";
import NewApplication from "./NewApplication";

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
          <PageContent className="applications" withFloatingBar>
            <main>
              <div className="applications__header">
                <h1>My Apps</h1>
              </div>
              <div
                className={classNames("previews", {
                  "previews--center": (data?.apps.length || 0) < 3,
                })}
              >
                <Link onClick={handleNewAppClick} to="">
                  <div className="applications__new-app">
                    <Icon icon="plus" />
                    Create New App
                  </div>
                </Link>

                {data?.apps.map((app) => {
                  return <ApplicationCard key={app.id} app={app} />;
                })}
              </div>
              <Snackbar open={Boolean(error)} message={errorMessage} />
            </main>
          </PageContent>
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
      updatedAt
      builds(orderBy: { createdAt: Desc }, take: 1) {
        version
        createdAt
      }
    }
  }
`;
