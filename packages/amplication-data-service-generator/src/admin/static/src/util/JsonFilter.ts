import { JsonValue } from "type-fest";
export class JsonFilter {
  equals?: Omit<JsonValue, "null">;
  not?: Omit<JsonValue, "null">;
}
