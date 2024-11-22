import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { createClient } from "graphql-ws";
import { getToken } from "./authentication/authentication";
import {
  REACT_APP_CODE_GENERATOR_CATALOG_API_DATA_SOURCE,
  REACT_APP_DATA_SOURCE,
  REACT_APP_PLUGIN_API_DATA_SOURCE,
} from "./env";
import "./index.scss";
import {
  ANALYTICS_SESSION_ID_HEADER_KEY,
  getSessionId,
} from "./util/analytics";

const wsLink = new GraphQLWsLink(
  createClient({
    url: REACT_APP_DATA_SOURCE.replace("http", "ws").replace("https", "wss"),
    connectionParams: () => ({
      authorization: `Bearer ${getToken()}`,
    }),
  })
);

const httpLink = createHttpLink({
  uri: REACT_APP_DATA_SOURCE,
});

const pluginApiHttpLink = createHttpLink({
  uri: REACT_APP_PLUGIN_API_DATA_SOURCE,
});

const codeGeneratorCatalogHttpLink = createHttpLink({
  uri: REACT_APP_CODE_GENERATOR_CATALOG_API_DATA_SOURCE,
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

export const apolloClient = new ApolloClient({
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
        ApolloLink.split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          authLink.concat(wsLink),
          authLink.concat(httpLink)
        )
      )
    )
  ),
});
