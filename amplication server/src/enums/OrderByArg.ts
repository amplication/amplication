import { registerEnumType } from "@nestjs/graphql";

export enum OrderByArg {
  asc = "asc",
  desc = "desc"
}
registerEnumType(OrderByArg, {
  name: "OrderByArg",
  description: undefined,
});
