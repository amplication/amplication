import { EnumDataType, Prisma } from "../../prisma";

export interface GeneratePromptForBreakTheMonolithArgs {
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

export interface BreakTheMonolithPromptInput {
  dataModels: {
    name: string;
    displayName: string;
    fields: {
      name: string;
      displayName: string;
      dataType: EnumDataType | string;
      relatedDataModel?: string;
    }[];
  }[];
}
