import buildGraphQLProvider from "ra-data-graphql-amplication";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { CREDENTIALS_LOCAL_STORAGE_ITEM } from "../auth-provider/ra-auth-basic-http";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
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
