import { EnumUserActionStatus } from "./types";

export interface UserActionResultWithPayload<T> {
  status: EnumUserActionStatus;
  data: T | null;
}
