import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
import { AuthProvider } from "react-admin";
import {
  CREDENTIALS_LOCAL_STORAGE_ITEM,
  USER_DATA_LOCAL_STORAGE_ITEM,
} from "../constants";
import { Credentials } from "../types";

type TData = {
  login: {
    username: string;
  };
};

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password }) {
      username
      roles
    }
  }
`;

export const authProvider: AuthProvider = {
  login: async (credentials: Credentials) => {
    const apolloClient = new ApolloClient({
      uri: "/graphql",
      cache: new InMemoryCache(),
    });

    const userData = await apolloClient.mutate<TData>({
      mutation: LOGIN,
      variables: {
        ...credentials,
      },
    });

    if (userData && userData.data?.login.username) {
      localStorage.setItem(
        CREDENTIALS_LOCAL_STORAGE_ITEM,
        createBasicAuthorizationHeader(
          credentials.username,
          credentials.password
        )
      );
      localStorage.setItem(
        USER_DATA_LOCAL_STORAGE_ITEM,
        JSON.stringify(userData.data)
      );
      return Promise.resolve();
    }
    return Promise.reject();
  },
  logout: () => {
    localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
    return Promise.resolve();
  },
  checkError: ({ status }: any) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM)
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () => {
    const str = localStorage.getItem(USER_DATA_LOCAL_STORAGE_ITEM);
    const userData: TData = JSON.parse(str || "");

    return Promise.resolve({
      id: userData.login.username,
      fullName: userData.login.username,
      avatar: undefined,
    });
  },
};
export default authProvider;

function createBasicAuthorizationHeader(
  username: string,
  password: string
): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}
