import { Entity, EntityField, Resource } from "../../models";

type EntityFieldPartial = Pick<
  EntityField,
  "name" | "displayName" | "dataType" | "properties"
>;

export interface EntityDataForBtm
  extends Pick<Entity, "id" | "name" | "displayName"> {
  versions: {
    fields: EntityFieldPartial[];
  }[];
}

export interface ResourceDataForBtm
  extends Pick<Resource, "id" | "name" | "project"> {
  entities: EntityDataForBtm[];
}

interface DataModel {
  name: string;
  relations: string[];
}

export interface BreakTheMonolithPromptInput {
  tables: DataModel[];
}

export interface BreakTheMonolithOutput {
  microservices: {
    name: string;
    functionality: string;
    tables: string[];
  }[];
}
