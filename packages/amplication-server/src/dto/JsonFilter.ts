import type { JsonValue } from "type-fest";

type InputJsonValue = Omit<JsonValue, "null">;

export class JsonFilter {
  equals?: InputJsonValue;
  path?: string[];
  not?: InputJsonValue;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  array_contains?: InputJsonValue;
}
