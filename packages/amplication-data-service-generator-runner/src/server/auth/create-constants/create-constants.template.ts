import { Credentials } from "../../auth/Credentials";
import { UserInfo } from "../../auth/UserInfo";

export const VALID_ID = "1";
declare class ID_TYPE {}

export const TEST_USER: UserInfo = {
  id: ID_TYPE,
  roles: ["User"],
  username: "ofek",
};
export const SIGN_TOKEN = "SIGN_TOKEN";
export const VALID_CREDENTIALS: Credentials = {
  username: "Valid User",
  password: "Valid User Password",
};
export const INVALID_CREDENTIALS: Credentials = {
  username: "Invalid User",
  password: "Invalid User Password",
};
