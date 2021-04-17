import { JsonValue } from "type-fest";

export type JsonNullableFilter = {
  equals?: JsonValue | null;
  not?: JsonValue | null;
};
