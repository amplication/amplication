import {
  CREDENTIALS_LOCAL_STORAGE_ITEM,
  USER_DATA_LOCAL_STORAGE_ITEM,
  //@ts-ignore
} from "../constants";
import { AuthProvider } from "react-admin";

declare const AUTH_PROVIDER: AuthProvider;

export type TData = {
  login: {
    username: string;
  };
};

export const reactAdminAuthProvider: AuthProvider = {
  ...AUTH_PROVIDER,
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
