import React from "react";
import { Icon } from "@rmwc/icon";

const apps = [
  {
    name: "",
  },
];

function Home() {
  return (
    <div>
      <h1>My Apps</h1>
      <div className="create-new-app">
        <Icon icon="add" /> Create New
      </div>
      {apps.map((app, i) => {
        return (
          <div key={i} className="app-preview">
            {app.name}
          </div>
        );
      })}
    </div>
  );
}

export default Home;
