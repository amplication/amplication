import * as ReactDOM from "react-dom/client";
import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getToken, setTokenFromCookie } from "./authentication/authentication";
import "@amplication/ui/design-system/icons";
import "./index.scss";
import App from "./App";
import {
  REACT_APP_DATA_SOURCE,
  REACT_APP_PLUGIN_API_DATA_SOURCE,
  CODE_GENERATOR_CATALOG_API_DATA_SOURCE,
} from "./env";
import { QueryClient, QueryClientProvider } from "react-query";
import { createUploadLink } from "apollo-upload-client";
import {
  getSessionId,
  ANALYTICS_SESSION_ID_HEADER_KEY,
} from "./util/analytics";

const queryClient = new QueryClient();

setTokenFromCookie();

if (!REACT_APP_DATA_SOURCE) {
  throw new Error("Missing ֿREACT_APP_DATA_SOURCE env variable");
}

const httpLink = createHttpLink({
  uri: REACT_APP_DATA_SOURCE,
});

const pluginApiHttpLink = createHttpLink({
  uri: REACT_APP_PLUGIN_API_DATA_SOURCE,
});

const codeGeneratorCatalogHttpLink = createHttpLink({
  uri: CODE_GENERATOR_CATALOG_API_DATA_SOURCE,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      [ANALYTICS_SESSION_ID_HEADER_KEY]: getSessionId(),
    },
  };
});

const uploadLink = createUploadLink({ uri: REACT_APP_DATA_SOURCE }); // Your GraphQL endpoint

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "pluginApiHttpLink",
    pluginApiHttpLink,
    ApolloLink.split(
      (operation) =>
        operation.getContext().clientName === "codeGeneratorCatalogHttpLink",
      codeGeneratorCatalogHttpLink,
      ApolloLink.split(
        (operation) => operation.getContext().hasUpload,
        authLink.concat(uploadLink),
        authLink.concat(httpLink)
      )
    )
  ),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>
);
