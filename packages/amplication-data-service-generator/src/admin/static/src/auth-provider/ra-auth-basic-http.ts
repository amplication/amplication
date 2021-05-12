const CREDENTIALS_LOCAL_STORAGE_ITEM = "credentials";

export type Credentials = {
  username: string;
  password: string;
};

const basicHttpAuthProvider = {
  login: (credentials: Credentials) => {
    localStorage.setItem(
      CREDENTIALS_LOCAL_STORAGE_ITEM,
      JSON.stringify(credentials)
    );
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
    return Promise.resolve();
  },
  checkError: ({ status }) => {
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
  // getIdentity: () => {
  //   return Promise.resolve(
  //     localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM)
  //   );
  // },
  getPermissions: () => Promise.resolve(),
};
export default basicHttpAuthProvider;
