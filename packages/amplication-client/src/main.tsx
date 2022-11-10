import * as ReactDOM from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getToken, setToken } from "./app/authentication/authentication";
// import "@amplication/design-system/icons";
// import "./index.scss";
import App from "./app/App";
import { REACT_APP_DATA_SOURCE } from "./env";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (token) {
  setToken(token);
}

if (!REACT_APP_DATA_SOURCE) {
  throw new Error("Missing ֿREACT_APP_DATA_SOURCE env variable");
}

const httpLink = createHttpLink({
  uri: REACT_APP_DATA_SOURCE,
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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </ApolloProvider>
  // </React.StrictMode>
);
