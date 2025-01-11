import { UserInfo } from "./UserInfo";

export interface IAuthStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (...any: any) => Promise<UserInfo>;
}
