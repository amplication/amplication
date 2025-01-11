import React from "react";
import * as ReactDOM from "react-dom/client";

import "@amplication/ui/design-system/icons";
import "@amplication/ui/design-system/custom-icons";
import "@amplication/ui/design-system/style/variables";
import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { setTokenFromCookie } from "./authentication/authentication";
import { REACT_APP_DATA_SOURCE } from "./env";
import { apolloClient } from "./graphqlClient";
import "./index.scss";

const queryClient = new QueryClient();

setTokenFromCookie();

if (!REACT_APP_DATA_SOURCE) {
  throw new Error("Missing ֿREACT_APP_DATA_SOURCE env variable");
}

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
