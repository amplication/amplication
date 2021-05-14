import buildGraphQLProvider from "ra-data-graphql-amplication";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
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
