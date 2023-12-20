import { JsonValue } from "type-fest";
export class JsonNullableFilter {
  equals?: JsonValue | null;
  not?: JsonValue | null;
}
