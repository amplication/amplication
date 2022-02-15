enum GraphQLArgsDtoEnum {
  CreateArgs = "createArgs",
  DeleteArgs = "deleteArgs",
  FindMany = "findMany",
  FindUnique = "findUnique",
  UpdateArgs = "updateArgs",
}

enum UtilsDtosEnum {
  OrderByInput = "orderByInput",
}

export enum EntityDtoTypeEnum {
  Entity = "entity",
  CreateInput = "createInput",
  UpdateInput = "updateInput",
  WhereInput = "whereInput",
  WhereUniqueInput = "whereUniqueInput",
}

enum EntityNestedInputEnum {
  RelationCreateNestedManyWithoutSourceInput = "relationCreateNestedManyWithoutSourceInput",
  RelationUpdateManyWithoutSourceInput = "relationUpdateManyWithoutSourceInput",
}

export const entityDtoTypeEnum = {
  ...GraphQLArgsDtoEnum,
  ...EntityDtoTypeEnum,
  ...UtilsDtosEnum,
  ...EntityNestedInputEnum,
};
export type EntityDtoType =
  | GraphQLArgsDtoEnum
  | EntityDtoTypeEnum
  | UtilsDtosEnum
  | EntityNestedInputEnum;
