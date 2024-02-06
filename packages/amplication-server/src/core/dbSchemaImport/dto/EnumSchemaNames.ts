import { registerEnumType } from "@nestjs/graphql";

export enum EnumSchemaNames {
  CalDotCom = "CalDotCom",
  NextCrmApp = "NextCrmApp",
  Abby = "Abby",
  WebStudio = "WebStudio",
}

registerEnumType(EnumSchemaNames, {
  name: "EnumSchemaNames",
});
