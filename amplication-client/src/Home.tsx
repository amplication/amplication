import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import { apps } from "./mock.json";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>My Apps</h1>
      <div className="apps">
        <div className="create-new-app">
          <Icon icon="add" /> Create New
        </div>
        {apps.map(app => {
          return (
            <Link key={app.id} to={`/applications/${app.id}/`}>
              <div className="app-preview">
                <header>
                  <div className="icon"></div>
                  <h2>{app.name}</h2>
                </header>
                <p>{app.description}</p>
                <hr />
                <footer>
                  <span>
                    App Version {app.versions[app.versions.length - 1].id}
                  </span>
                  <Link to={`/applications/${app.id}/history`}>
                    Show History
                  </Link>
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
