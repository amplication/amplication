import { Entity, EntityField, Resource } from "../../prisma";

type EntityFieldPartial = Pick<
  EntityField,
  "name" | "displayName" | "dataType" | "properties"
>;

interface EntityPartial
  extends Pick<Entity, "id" | "name" | "displayName" | "pluralDisplayName"> {
  versions: [
    {
      fields: EntityFieldPartial[];
    }
  ];
}

interface ResourcePartial extends Pick<Resource, "name"> {
  entities: EntityPartial[];
}

export type GeneratePromptForBreakTheMonolithArgs = ResourcePartial;

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
