import buildGraphQLProvider from "ra-data-graphql-amplication";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = createHttpLink({
  //@todo: get the url from a configuration file
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  //@todo: get the authentication token from local storage
  const token = "YWRtaW46YWRtaW4=";
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
});
