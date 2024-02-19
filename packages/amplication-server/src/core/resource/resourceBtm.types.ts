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
  fields: {
    name: string;
    dataType: string;
  }[];
}

export interface BreakTheMonolithPromptInput {
  dataModels: DataModel[];
}

export interface BreakTheMonolithOutput {
  microservices: {
    name: string;
    functionality: string;
    dataModels: string[];
  }[];
}
