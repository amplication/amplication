import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import "./Home.css";

const apps = [
  {
    id: "test",
    name: "Test App",
    description:
      "App description - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    version: "V2",
  },
];

function Home() {
  return (
    <div className="home">
      <h1>My Apps</h1>
      <div className="apps">
        <div className="create-new-app">
          <Icon icon="add" /> Create New
        </div>
        {apps.map((app) => {
          return (
            <div key={app.id} className="app-preview">
              <header>
                <div className="icon"></div>
                <h2>{app.name}</h2>
              </header>
              <p>{app.description}</p>
              <hr />
              <footer>
                <span>App Version {app.version}</span>
                <Link to={`/applications/${app.id}/history`}>Show History</Link>
              </footer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
