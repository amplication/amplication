import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "./Applications.css";
import { formatError } from "./errorUtil";

type TData = {
  me: {
    organization: {
      apps: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    };
  };
};

function Applications() {
  const { data, error } = useQuery<TData>(GET_APPLICATIONS);
  const errorMessage = formatError(error);

  return (
    <>
      <div className="applications">
        <h1>My Apps</h1>
        <div className="previews">
          <Link className="create-new-app" to="/new">
            <Icon icon="add" /> Create New
          </Link>
          {data?.me.organization.apps.map((app) => {
            return (
              <Link key={app.id} to={`/${app.id}/`}>
                <div className="app-preview">
                  <header>
                    <div className="icon"></div>
                    <h2>{app.name}</h2>
                  </header>
                  <p>{app.description}</p>
                  <hr />
                  <footer>
                    {/* <span>
                    App Version {app.versions[app.versions.length - 1].id}
                  </span> */}
                    {/* <Link to={`/applications/${app.id}/history`}>
                    Show History
                  </Link> */}
                  </footer>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default Applications;

export const GET_APPLICATIONS = gql`
  query getApplications {
    me {
      organization {
        apps {
          id
          name
          description
        }
      }
    }
  }
`;
