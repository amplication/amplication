import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
// @ts-ignore
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as amplicationDesignSystem from "@amplication/design-system";
import "@amplication/design-system/icons";

ReactDOM.render(
  <React.StrictMode>
    <amplicationDesignSystem.Provider>
      <Router>
        <App />
      </Router>
    </amplicationDesignSystem.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
