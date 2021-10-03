export type Credentials = {
  username: string;
  password: string;
};
export type LoginMutateResult = {
  login: {
    username: string;
    accessToken: string;
  };
};
