import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import * as amplicationDesignSystem from "@amplication/design-system";
import "@amplication/design-system/icons";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { getToken, setToken } from "./authentication/authentication";
import { setContext } from "@apollo/client/link/context";

const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (token) {
  setToken(token);
}

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <amplicationDesignSystem.Provider>
        <Router>
          <App />
        </Router>
      </amplicationDesignSystem.Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
