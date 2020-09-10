import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import "./index.scss";
import "./style/amplication-font.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { getToken, setToken } from "./authentication/authentication";
import { RMWCProvider } from "@rmwc/provider";

const params = new URLSearchParams(window.location.search);
const githubAccessToken = params.get("github-access-token");
if (githubAccessToken) {
  setToken(githubAccessToken);
}

const apolloClient = new ApolloClient({
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
      <RMWCProvider
        // Globally disable ripples
        ripple={false}
        icon={{
          basename: "amp-icon",
        }}
      >
        <Router>
          <App />
        </Router>
      </RMWCProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
