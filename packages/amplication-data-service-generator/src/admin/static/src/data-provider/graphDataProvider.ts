import buildGraphQLProvider from "ra-data-graphql";
import pluralize from "pluralize";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import buildQueryFactory from "./buildQuery";

import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  // CREATE,
  // UPDATE,
  // UPDATE_MANY,
  // DELETE,
  // DELETE_MANY
} from "ra-core";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = "YWRtaW46YWRtaW4=";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Basic ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default buildGraphQLProvider({
  client: apolloClient,
  buildQuery: buildQueryFactory,
  introspection: {
    operationNames: {
      [GET_ONE]: (resource) => `${(resource.name as string).toLowerCase()}`,
      [GET_LIST]: (resource) =>
        `${pluralize((resource.name as string).toLowerCase())}`,
      [GET_MANY]: (resource) =>
        `${pluralize((resource.name as string).toLowerCase())}`,
      [GET_MANY_REFERENCE]: (resource) =>
        `${pluralize((resource.name as string).toLowerCase())}`,
    },
  },
});
