import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { getToken } from "./authentication";

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_URI,
  request: (operation) => {
    const token = getToken();
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
