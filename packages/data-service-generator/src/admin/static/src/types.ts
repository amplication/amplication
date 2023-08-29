import { JsonValue } from "type-fest";

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
export type InputJsonValue = Omit<JsonValue, "null">;
