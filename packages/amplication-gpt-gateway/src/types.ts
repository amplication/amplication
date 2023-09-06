import type { JsonValue } from "type-fest";

export type InputJsonValue = Omit<JsonValue, "null">;
