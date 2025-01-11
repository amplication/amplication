import { registerEnumType } from "@nestjs/graphql";

export enum EnumTimeGroup {
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
}

registerEnumType(EnumTimeGroup, {
  name: "EnumTimeGroup",
});
