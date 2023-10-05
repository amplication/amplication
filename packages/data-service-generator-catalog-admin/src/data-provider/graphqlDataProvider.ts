import buildGraphQLProvider from "ra-data-graphql-amplication";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { CREDENTIALS_LOCAL_STORAGE_ITEM } from "../constants";
import { REACT_APP_SERVER_URL } from "../env";

const httpLink = createHttpLink({
  uri: `${REACT_APP_SERVER_URL}/graphql`,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default buildGraphQLProvider({
  client: apolloClient,
});
