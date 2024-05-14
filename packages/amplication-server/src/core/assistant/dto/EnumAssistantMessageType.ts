import { registerEnumType } from "@nestjs/graphql";

export enum EnumAssistantMessageType {
  Default = "Default",
  Onboarding = "Onboarding",
}

registerEnumType(EnumAssistantMessageType, {
  name: "EnumAssistantMessageType",
});
