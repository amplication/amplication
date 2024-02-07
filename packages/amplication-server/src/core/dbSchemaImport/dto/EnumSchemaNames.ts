import { registerEnumType } from "@nestjs/graphql";

export enum EnumSchemaNames {
  CalDotCom = "CalDotCom",
  Formbricks = "Formbricks",
  Abby = "Abby",
  Papermark = "Papermark",
}

registerEnumType(EnumSchemaNames, {
  name: "EnumSchemaNames",
});
