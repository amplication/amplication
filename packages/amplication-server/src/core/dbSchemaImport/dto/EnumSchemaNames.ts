import { registerEnumType } from "@nestjs/graphql";

export enum EnumSchemaNames {
  CalDotCom = "CalDotCom",
}

registerEnumType(EnumSchemaNames, {
  name: "EnumSchemaNames",
});
