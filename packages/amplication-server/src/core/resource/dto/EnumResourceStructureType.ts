import { registerEnumType } from "@nestjs/graphql";

export enum EnumResourceStructureType {
  Mono = "Mono",
  Poly = "Poly",
}

registerEnumType(EnumResourceStructureType, {
  name: "EnumResourceStructureType",
});
