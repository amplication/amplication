import { UserInfo } from "./UserInfo";

export interface IAuthStrategy {
  validate: (...any: any) => Promise<UserInfo>;
}
