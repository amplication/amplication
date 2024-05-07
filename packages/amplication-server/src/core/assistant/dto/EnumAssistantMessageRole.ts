import { registerEnumType } from "@nestjs/graphql";

export enum EnumAssistantMessageRole {
  User = "User",
  Assistant = "Assistant",
}

registerEnumType(EnumAssistantMessageRole, {
  name: "EnumAssistantMessageRole",
});
