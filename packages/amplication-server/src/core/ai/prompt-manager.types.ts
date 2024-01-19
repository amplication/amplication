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

interface DataModel {
  name: string;
  fields: {
    name: string;
    dataType: string;
  }[];
}

export interface BreakTheMonolithPromptInput {
  dataModels: DataModel[];
}

export interface BreakTheMonolithPromptOutput {
  microservices: {
    name: string;
    functionality: string;
    dataModels: DataModel[];
  }[];
}
