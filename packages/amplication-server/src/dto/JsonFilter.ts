import type { JsonValue } from "type-fest";

type InputJsonValue = Omit<JsonValue, "null">;

export class JsonFilter {
  equals?: InputJsonValue;
  path?: string[];
  not?: InputJsonValue;
}
