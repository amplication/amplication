import React from "react";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "./Applications.scss";
import { formatError } from "../util/error";
import MainLayout from "../Layout/MainLayout";
import PageContent from "../Layout/PageContent";
import ApplicationCard from "./ApplicationCard";
import { Button } from "../Components/Button";

type TData = {
  apps: Array<{
    id: string;
    name: string;
    description: string;
    updatedAt: Date;
  }>;
};

function Applications() {
  const { data, error } = useQuery<TData>(GET_APPLICATIONS);
  const errorMessage = formatError(error);

  return (
    <>
      <MainLayout>
        <MainLayout.Menu></MainLayout.Menu>
        <MainLayout.Content>
          <PageContent className="applications" withFloatingBar>
            <main>
              <div className="applications__header">
                <h1>My Apps</h1>

                <Link className="create-new-app" to="/new">
                  <Button>Create New App</Button>
                </Link>
              </div>

              <div className="previews">
                {data?.apps.map((app) => {
                  return (
                    <ApplicationCard
                      key={app.id}
                      name={app.name}
                      id={app.id}
                      description={app.description}
                      updatedAt={app.updatedAt}
                    ></ApplicationCard>
                  );
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
    apps(orderBy: { createdAt: desc }) {
      id
      name
      description
      updatedAt
    }
  }
`;
