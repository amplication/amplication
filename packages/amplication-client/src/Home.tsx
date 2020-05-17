import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import "./Home.css";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

type TData = {
  me: {
    organization: {
      id: string;
      apps: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    };
  };
};

function Home() {
  const { data } = useQuery<TData>(GET_APPS);
  return (
    <div className="home">
      <h1>My Apps</h1>
      <div className="apps">
        <Link className="create-new-app" to="/applications/new">
          <Icon icon="add" /> Create New
        </Link>
        {data?.me.organization.apps.map((app) => {
          return (
            <Link key={app.id} to={`/${data?.me.organization.id}/${app.id}/`}>
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
  );
}

export default Home;

const GET_APPS = gql`
  query getApplications {
    me {
      organization {
        id
        apps {
          id
          name
          description
        }
      }
    }
  }
`;
