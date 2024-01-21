import { Entity, EntityField, Resource } from "../../prisma";

type EntityFieldPartial = Pick<
  EntityField,
  "name" | "displayName" | "dataType" | "properties"
>;

export interface EntityPartial
  extends Pick<Entity, "id" | "name" | "displayName"> {
  versions: {
    fields: EntityFieldPartial[];
  }[];
}

export interface ResourcePartial extends Pick<Resource, "id" | "name"> {
  entities: EntityPartial[];
}
