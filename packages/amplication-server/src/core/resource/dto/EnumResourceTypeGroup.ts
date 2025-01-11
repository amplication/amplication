import { registerEnumType } from "@nestjs/graphql";

export enum EnumResourceTypeGroup {
  Services = "Services",
  Platform = "Platform",
}

registerEnumType(EnumResourceTypeGroup, { name: "EnumResourceTypeGroup" });
