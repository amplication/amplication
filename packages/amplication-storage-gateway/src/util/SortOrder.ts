import { registerEnumType } from "@nestjs/graphql";

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}
registerEnumType(SortOrder, {
  name: "SortOrder",
  description: undefined,
});
