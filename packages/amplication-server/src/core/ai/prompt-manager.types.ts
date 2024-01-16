import { EnumDataType, Prisma } from "../../prisma";

export interface PromptManagerGeneratePromptForBreakTheMonolithArgs {
  name: string;
  entities: {
    id: string;
    name: string;
    displayName: string;
    pluralDisplayName: string;
    versions: {
      fields: {
        name: string;
        displayName: string;
        dataType: EnumDataType;
        properties?: Prisma.JsonValue;
      }[];
    }[];
  }[];
}
